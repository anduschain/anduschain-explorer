package db

import (
	"context"
	"errors"
	"fmt"
	"github.com/anduschain/anduschain-explorer/config"
	"github.com/anduschain/anduschain-explorer/db/schema"
	"github.com/anduschain/anduschain-explorer/service"
	"github.com/anduschain/go-anduschain/fairnode/fairdb/fntype"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/x/bsonx"
	"log"
	"time"
)

type FairNodeDB struct {
	client        *mongo.Client
	context       context.Context
	url           string
	Mongo         *mongo.Session
	ActiveNodeCol *mongo.Collection
	BlockChain    *mongo.Collection
	Transactions  *mongo.Collection
}

func containsKey(doc bson.Raw, key ...string) bool {
	_, err := doc.LookupErr(key...)
	if err != nil {
		return false
	}
	return true
}

func NewSession() (*FairNodeDB, error) {
	client, err := mongo.NewClient(options.Client().ApplyURI(config.DBConnUrl))
	if err != nil {
		fmt.Println("failed", config.DBConnUrl)
		return nil, err
	}
	ctx := context.Background()
	return &FairNodeDB{client: client, context: ctx}, nil
}

func (fnb *FairNodeDB) Start() error {
	err := fnb.client.Connect(fnb.context)
	if err != nil {
		log.Fatal(err)
		return errors.New(fmt.Sprintf("url : %s, msg : %s", config.DBConnUrl, err))
	}
	fnb.ActiveNodeCol = fnb.client.Database(config.GetDBName()).Collection("ActiveNode")
	fnb.BlockChain = fnb.client.Database(config.GetDBName()).Collection("BlockChain")
	fnb.Transactions = fnb.client.Database(config.GetDBName()).Collection("Transactions")
	fmt.Println("Successfully Connected to MongoDB!")
	return nil
}

func (fnb *FairNodeDB) Stop() error {
	if err := fnb.client.Disconnect(fnb.context); err != nil {
		return err
	}
	fmt.Println("successfully disconnected")
	return nil
}

func (fnb *FairNodeDB) GetRecent() ([]schema.RespBlockPage, []schema.RespTransaction) {
	var blocks []schema.RespBlockPage
	var rtxs []schema.RespTransaction
	block := new(fntype.Block)
	tx := new(fntype.STransaction)

	findOpts := options.Find().
		SetSort(bsonx.Doc{{"header.number", bsonx.Int32(-1)}}).
		SetLimit(10)
	blockCursor, err := fnb.BlockChain.Find(fnb.context, bson.M{}, findOpts)
	if err != nil {
		return nil, nil
	}

	for blockCursor.Next(fnb.context) {
		blockCursor.Decode(&block)
		blocks = append(blocks, schema.RespBlockPage{
			Number:  block.Header.Number,
			Time:    block.Header.Time,
			TotalTx: len(block.Body.Transactions),
			Miner:   block.Header.Coinbase,
		})
		txs := block.Body.Transactions
		for i := range txs {
			if len(rtxs) > 10 {
				break
			}
			txhash := txs[i].Hash
			findOpts = options.Find().SetLimit(10)
			txCursor, _ := fnb.Transactions.Find(fnb.context, bson.M{"_id": txhash}, findOpts)
			if txCursor == nil {
				continue
			}
			for txCursor.Next(fnb.context) {
				txCursor.Decode(&tx)
				rtxs = append(rtxs, schema.RespTransaction{
					Hash:   tx.Hash,
					Number: block.Header.Number,
					Time:   block.Header.Time,
					From:   tx.From,
					To:     tx.Data.Recipient,
					Type:   service.GetTxtype(tx.Data.Recipient),
					Amount: tx.Data.Amount,
					Price:  tx.Data.Price,
				})
			}
		}
	}
	return blocks, rtxs
}

func (fnb *FairNodeDB) GetBlockTotalCount() (int64, error) {
	count, err := fnb.BlockChain.EstimatedDocumentCount(fnb.context,
		options.EstimatedDocumentCount().SetMaxTime(1*time.Second))
	if err != nil {
		//fmt.Errorf("exceeds time limit, %v", err)
		return 0, err
	}
	return count, nil
}

func (fnb *FairNodeDB) GetBlocks(page, PageRow int) []schema.RespBlockPage {
	findOpts := options.Find().
		SetSort(bson.M{"header.number": -1}).
		SetProjection(bson.M{"header": 1}).
		SetSkip(int64((page - 1) * PageRow)).
		SetLimit(int64(PageRow))

	/*db.getCollection('BlockChain').aggregate
	([
	{"$sort":{"header.number":-1}},
	{"$limit":25},
	    {
	        "$project": {
	            "header.number":1,
	            "header.timestamp":1,
	            "header.miner":1,
	            "count": {"$cond": { if: { "$isArray": "$body.transactions" }, then: {"$size":"$body.transactions"}, else: -1}}
	        }
	    }
	]) */

	blockCursor, err := fnb.BlockChain.Find(fnb.context, bson.M{}, findOpts)
	if err != nil {
		return nil
	}

	block := new(fntype.Block)
	var re []schema.RespBlockPage
	for blockCursor.Next(fnb.context) {
		blockCursor.Decode(block)
		re = append(re, schema.RespBlockPage{
			Number:  block.Header.Number,
			Time:    block.Header.Time,
			TotalTx: fnb.getBlockTxCnt(block.Hash),
			Miner:   block.Header.Coinbase,
		})
	}
	return re
}

func (fnb *FairNodeDB) getBlockTxCnt(hash string) int {
	count, err := fnb.Transactions.CountDocuments(fnb.context, bson.M{"blockHash": hash},
		options.Count().SetMaxTime(config.Conf.DbTimeOut*time.Second))
	if err != nil {
		return 0
	}
	return int(count)
}

func (fnb *FairNodeDB) GetBlockDetail(blockNum int64) (error, *schema.StoredBlock) {
	findOneOpts := options.FindOne().SetProjection(bson.M{"header": 1, "body.transactions.hash": 1, "body.voters._id": 1})

	block := new(fntype.Block)
	err := fnb.BlockChain.FindOne(fnb.context, bson.M{"header.number": blockNum}, findOneOpts).Decode(block)
	if err != nil {
		return err, nil
	}

	transferTxCnt, err := fnb.Transactions.CountDocuments(fnb.context, bson.M{"blockHash": block.Hash, "data.type": 0}, options.Count().SetMaxTime(config.Conf.DbTimeOut*time.Second))
	if err != nil {
		return err, nil
	}
	contractTxCnt, err := fnb.Transactions.CountDocuments(fnb.context, bson.M{"blockHash": block.Hash, "data.to": "contract"}, options.Count().SetMaxTime(config.Conf.DbTimeOut*time.Second))
	if err != nil {
		return err, nil
	}
	joinTxCnt, err := fnb.Transactions.CountDocuments(fnb.context, bson.M{"blockHash": block.Hash, "data.type": 1}, options.Count().SetMaxTime(config.Conf.DbTimeOut*time.Second))
	if err != nil {
		return err, nil
	}
	if transferTxCnt >= contractTxCnt {
		transferTxCnt -= contractTxCnt
	}
	var eachTxCnt []uint64
	eachTxCnt = append(eachTxCnt, uint64(transferTxCnt))
	eachTxCnt = append(eachTxCnt, uint64(joinTxCnt))
	eachTxCnt = append(eachTxCnt, uint64(contractTxCnt))

	return nil, &schema.StoredBlock{
		Hash:      block.Hash,
		Header:    block.Header,
		TxCnt:     uint64(len(block.Body.Transactions)),
		EachTxCnt: eachTxCnt,
		//TransferTxCnt: int(transferTxCnt),
		//JoinTxCnt:     int(joinTxCnt),
		Voter: block.Body.Voters,
	}
}

func (fnb *FairNodeDB) GetMiners() ([]fntype.HeartBeat, error) {
	var actlist []fntype.HeartBeat
	activeNodeColCursor, err := fnb.ActiveNodeCol.Find(fnb.context, bson.M{})
	activeNodeColCursor.All(fnb.context, &actlist)
	if err != nil {
		return nil, err
	}
	return actlist, nil
}

func (fnb *FairNodeDB) GetTxTotalCount() (int64, error) {
	count, err := fnb.Transactions.EstimatedDocumentCount(fnb.context,
		options.EstimatedDocumentCount().SetMaxTime(config.Conf.DbTimeOut*time.Second))
	if err != nil {
		//fmt.Errorf("exceeds time limit, %v", err)
		return 0, err
	}
	return count, nil
}

func (fnb *FairNodeDB) GetTxCountWithAccount(account string) (int64, error) {
	count, err := fnb.Transactions.CountDocuments(fnb.context, bson.M{"From": account},
		options.Count().SetMaxTime(config.Conf.DbTimeOut*time.Second))
	if err != nil {
		return 0, err
	}
	return count, nil
}

func (fnb *FairNodeDB) GetTxWithAccount(account string, PageRow, page int64) []schema.RespTransaction {
	var res []schema.RespTransaction
	findOpts := options.Find().
		SetSkip(int64((page - 1) * PageRow)).
		SetLimit(int64(PageRow))
	txCursor, err := fnb.Transactions.Find(fnb.context, bson.M{"From": account}, findOpts)
	if err != nil {
		return nil
	}
	tx := new(fntype.STransaction)
	for txCursor.Next(fnb.context) {
		txCursor.Decode(tx)
		block := fnb.getBlockHeader(tx.BlockHash)
		res = append(res, schema.RespTransaction{
			Hash:   tx.Hash,
			Number: block.Header.Number,
			Time:   block.Header.Time,
			From:   tx.From,
			To:     tx.Data.Recipient,
			Type:   service.GetTxtype(tx.Data.Recipient),
			Amount: tx.Data.Amount,
			Price:  tx.Data.Price,
		})
	}
	return res
}

func (fnb *FairNodeDB) getBlockHeader(hash string) *fntype.BlockHeader {
	findOneOpts := options.FindOne().SetProjection(bson.M{"header": 1})
	header := new(fntype.BlockHeader)
	err := fnb.BlockChain.FindOne(fnb.context, bson.M{"_id": hash}, findOneOpts).Decode(header)
	if err != nil {
		return nil
	}
	return header
}

const (
	TRANSFER = 0
	JOINTX   = 1
	CONTRACT = 2
)

func (fnb *FairNodeDB) GetTransactionByType(PageRow, page, blockNum int64, txType int) []schema.RespTransaction {
	findOneOpts := options.FindOne().SetProjection(bson.M{"_id": 1, "header": 1})
	block := new(fntype.Block)
	var err error
	err = fnb.BlockChain.FindOne(fnb.context, bson.M{"header.number": blockNum}, findOneOpts).Decode(block)
	if err != nil {
		return nil
	}

	var res []schema.RespTransaction
	var tx fntype.STransaction
	var respTx schema.RespTransaction

	findOpts := options.Find().
		SetSkip(int64((page - 1) * PageRow)).
		SetLimit(int64(PageRow))

	var txCursor *mongo.Cursor

	//({"data.type":0, "data.to":{"$not":{"$regex":"contract"}}})
	if txType == TRANSFER {
		txCursor, err = fnb.Transactions.Find(fnb.context, bson.M{"blockHash": block.Hash, "data.type": txType, "data.to": bson.M{"$not": bson.M{"$regex": "contract"}}}, findOpts)
	} else if txType == JOINTX {
		txCursor, err = fnb.Transactions.Find(fnb.context, bson.M{"blockHash": block.Hash, "data.type": txType}, findOpts)
	} else if txType == CONTRACT {
		txCursor, err = fnb.Transactions.Find(fnb.context, bson.M{"blockHash": block.Hash, "data.to": "contract"}, findOpts)
	}
	if err != nil {
		return nil
	}

	for txCursor.Next(fnb.context) {
		txCursor.Decode(&tx)
		respTx.Hash = tx.Hash
		respTx.Number = block.Header.Number
		respTx.Time = block.Header.Time
		respTx.From = tx.From
		respTx.To = tx.Data.Recipient
		respTx.Type = service.GetTxtype(tx.Data.Recipient)
		respTx.Amount = tx.Data.Amount
		respTx.Price = tx.Data.Price
		res = append(res, respTx)
	}
	return res
}

func (fnb *FairNodeDB) GetTransactions(PageRow, page, blockNum int64) []schema.RespTransaction {
	var res []schema.RespTransaction
	b := struct {
		Hash string `json:"blockHash" bson:"_id,omitempty"`
		Body struct {
			Tx fntype.Transaction `json:"transactions" bson:"transactions"`
		}
	}{}
	var query []bson.M
	if blockNum > 0 {
		query = []bson.M{
			{"$match": bson.M{"header.number": blockNum}},
			{"$project": bson.M{"body.transactions.hash": 1}},
			{"$unwind": "$body.transactions"},
			{"$skip": (page - 1) * PageRow},
			{"$limit": PageRow},
		}
	} else {
		query = []bson.M{
			{"$sort": bson.D{{"header.number", -1}}},
			{"$project": bson.D{{"body.transactions.hash", 1}}},
			{"$unwind": "$body.transactions"},
			{"$skip": (page - 1) * PageRow},
			{"$limit": PageRow},
		}
	}
	blockCursor, err := fnb.BlockChain.Aggregate(fnb.context, query)
	if err != nil {
		return nil
	}
	for blockCursor.Next(fnb.context) {
		blockCursor.Decode(&b)
		res = append(res, *fnb.GetTransaction(b.Body.Tx.Hash))
	}
	return res
}

func (fnb *FairNodeDB) GetRecentBlocks() []schema.RespBlock {
	var res []schema.RespBlock
	block := new(fntype.Block)
	findOpts := options.Find().
		SetProjection(bson.M{"header": 1}).
		SetSort(bson.M{"header.number": -1}).
		SetLimit(100)
	blockCursor, err := fnb.BlockChain.Find(fnb.context, bson.M{}, findOpts)
	if err != nil {
		return nil
	}
	for blockCursor.Next(fnb.context) {
		blockCursor.Decode(block)
		res = append(res, schema.RespBlock{
			Hash:      block.Hash,
			TimeStamp: block.Header.Time,
			Number:    block.Header.Number,
			Diffculty: block.Header.Difficulty,
		})
	}
	return res
}

func (fnb *FairNodeDB) GetTransaction(hash string) *schema.RespTransaction {
	tx := new(fntype.STransaction)
	err := fnb.Transactions.FindOne(fnb.context, bson.M{"_id": hash}).Decode(&tx)
	if err != nil {
		return nil
	}
	block := fnb.getBlockHeader(tx.BlockHash)
	return &schema.RespTransaction{
		Hash:   tx.Hash,
		Number: block.Header.Number,
		Time:   block.Header.Time,
		From:   tx.From,
		To:     tx.Data.Recipient,
		Type:   service.GetTxtype(tx.Data.Recipient),
		Amount: tx.Data.Amount,
		Price:  tx.Data.Price,
	}
}

func (fnb *FairNodeDB) GetTransactionDetail(hash string) *schema.RespDetailTransaction {
	tx := new(fntype.STransaction)
	err := fnb.Transactions.FindOne(fnb.context, bson.M{"_id": hash}).Decode(&tx)
	if err != nil {
		return nil
	}
	block := fnb.getBlockHeader(tx.BlockHash)
	return &schema.RespDetailTransaction{
		RT: schema.RespTransaction{
			Hash:   tx.Hash,
			Number: block.Header.Number,
			Time:   block.Header.Time,
			From:   tx.From,
			To:     tx.Data.Recipient,
			Type:   service.GetTxtype(tx.Data.Recipient),
			Amount: tx.Data.Amount,
			Price:  tx.Data.Price,
		},
		Tx: *tx,
	}
}
