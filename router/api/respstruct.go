package api

import (
	"github.com/anduschain/anduschain-explorer-backend/db/schema"
)

type Response struct {
	Status bool `json:"status" xml:"status"`
}

type Account struct {
	Addr    string `json:"address" xml:"address"`
	Balacne string `json:"balance" xml:"balance"`
}

type PageNumResp struct {
	Response
	PageTotalNum int `json:"pageTotalNum" xml:"pageTotalNum"`
	TotalCount   int64 `json:"totalCount" xml:"totalCount"`
	PageRow      int `json:"pageRow" xml:"pageRow"`
}

type BlocksResp struct {
	Response
	Blocks []schema.RespBlockPage `json:"blocks" xml:"blocks"`
}

type BlockDetailResp struct {
	Response
	Block schema.StoredBlock
}

type AccountResp struct {
	Response
	Account
}

type TransctsionsResp struct {
	Response
	Txs []schema.RespTransaction `json:"transactions" xml:"transactions"`
}

type RecentlyResp struct {
	Response
	Blocks       []schema.RespBlockPage   `json:"blocks" xml:"blocks"`
	Transactions []schema.RespTransaction `json:"transactions" xml:"transactions"`
}

type ErrResp struct {
	Response
	Msg string `json:"msg" xml:"msg"`
}

type MinerResp struct {
	Response
	IpAddr []string `json:"ipaddr" xml:"ipaddr"`
}

type TransactionResp struct {
	Response
	Transaction *schema.RespDetailTransaction `json:"transaction" xml:"transaction"`
}

type RecentBlocksResp struct {
	Response
	Blocks []schema.RespBlock `json:"blocks" xml:"blocks"`
}

type WsResp struct {
	Response
	Code string `json:"code" xml:"code"`
}

type WsResponse struct {
	WsResp
	Blocks       []schema.RespBlockPage   `json:"blocks" xml:"blocks"`
	Transactions []schema.RespTransaction `json:"transactions" xml:"transactions"`
	GBlocks      []schema.RespBlock       `json:"gBlocks" xml:"gBlocks"`
	IpAddr       []string                 `json:"ipaddr" xml:"ipaddr"`
}

type WsRespHeader struct {
	WsResp
	Block schema.RespBlock `json:"block" xml:"block"`
}

type WsErrResponse struct {
	WsResp
	Msg string `json:"msg" xml:"msg"`
}
