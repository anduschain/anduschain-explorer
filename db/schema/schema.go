package schema

import (
	"github.com/anduschain/go-anduschain/fairnode/fairdb/fntype"
	"time"
)

type Header struct {
	ParentHash  string
	UncleHash   string
	Coinbase    string
	Root        string
	TxHash      string
	ReceiptHash string
	Difficulty  string
	Number      int64
	GasLimit    int64
	GasUsed     int64
	Time        string
	Extra       []byte
	MixDigest   string
	Nonce       int64
}

type Transaction struct {
	Txhash       string
	From         string
	To           string
	AccountNonce int64
	Price        string
	Amount       string
	Payload      []byte
}

type Txs struct {
	Header       Header
	Transactions Transaction
}

type ActiveNode struct {
	EnodeId  string
	Coinbase string
	Ip       string
	Time     time.Time
	Port     string
	Version  string
}

type StoredBlock struct {
	Hash          string
	Header        fntype.Header
	TxCnt         uint64
	EachTxCnt     []uint64
	//TransferTxCnt uint64
	//JoinTxCnt     uint64
	Voter         []fntype.Voter
}

type TotCnt struct {
	Totalcount int64
}

type RespTransaction struct {
	Hash   string `json:"hash" xml:"hash"`
	Number uint64 `json:"number" xml:"number"`
	Time   string `json:"time" xml:"time"`
	From   string `json:"from" xml:"from"`
	To     string `json:"to" xml:"to"`
	Type   string `json:"type" xml:"type"`
	Amount string `json:"amount" xml:"amount"`
	Price  string `json:"price" xml:"price"`
}

type RespDetailTransaction struct {
	RT RespTransaction
	Tx fntype.STransaction
}

type RespBlock struct {
	Hash      string `json:"hash" xml:"hash"`
	TimeStamp string `json:"timestamp" xml:"timestamp"`
	Number    uint64 `json:"number" xml:"number"`
	Diffculty string `json:"diffculty" xml:"diffculty"`
}

type RespBlockPage struct {
	Number  uint64 `json:"number" xml:"number"`
	Time    string `json:"time" xml:"time"`
	TotalTx int    `json:"totalTx" xml:"totalTx"`
	Miner   string `json:"miner" xml:"miner"`
}
