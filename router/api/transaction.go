package api

import (
	"errors"
	"github.com/anduschain/anduschain-explorer-backend/db"
	"github.com/anduschain/anduschain-explorer-backend/service/rpc"
	"github.com/anduschain/go-anduschain/common"
	"github.com/labstack/echo"
	"net/http"
	"strconv"
	"strings"
)

func GetTransactions(fdb *db.FairNodeDB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var page int64 = 0
		var resp TransctsionsResp
		p := c.Param("page")
		if strings.Compare("", p) != 0 {
			page, _ = strconv.ParseInt(p, 10, 64)
			resp.Txs = fdb.GetTransactions(int64(PageRow), page, 0)
			if len(resp.Txs) > 0 {
				resp.Status = true
			}

			return c.JSON(http.StatusOK, resp)
		} else {
			return errorResponse(errors.New("잘못된 호출"), c)
		}
	}
}

func Transactions(fdb *db.FairNodeDB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var resp PageNumResp
		totCnt, err := fdb.GetTxTotalCount()
		if err != nil {
			return c.JSON(http.StatusOK, resp)
		}

		resp.TotalCount = totCnt
		resp.PageRow = PageRow

		if totCnt > 0 {
			resp.Status = true
			if totCnt < int64(PageRow) {
				resp.PageTotalNum = 1
			} else {
				resp.PageTotalNum = int(totCnt / int64(PageRow))
			}
		}

		return c.JSON(http.StatusOK, resp)
	}
}

func TxsAccount(fdb *db.FairNodeDB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var resp PageNumResp
		p := c.Param("account")
		if strings.Compare("", p) != 0 {
			cnt, err := fdb.GetTxCountWithAccount(common.HexToAddress(p).String())
			if err != nil {
				return c.JSON(http.StatusOK, resp)
			}

			resp.TotalCount = cnt
			resp.PageRow = PageRow

			if cnt > 0 {
				resp.Status = true
				if cnt < int64(PageRow) {
					resp.PageTotalNum = 1
				} else {
					resp.PageTotalNum = int(cnt / int64(PageRow))
				}
			}

			return c.JSON(http.StatusOK, resp)
		} else {
			return errorResponse(errors.New("잘못된 호출"), c)
		}
	}
}

func GetTxsAccount(fdb *db.FairNodeDB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var resp TransctsionsResp
		account, p := c.Param("account"), c.Param("page")
		if strings.Compare(account, "") != 0 && strings.Compare(p, "") != 0 {
			pg, _ := strconv.ParseInt(p, 10, 64)
			resp.Txs = fdb.GetTxWithAccount(common.HexToAddress(account).String(), int64(PageRow), pg)

			if len(resp.Txs) != 0 {
				resp.Status = true
			}

			return c.JSON(http.StatusOK, resp)

		} else {
			return errorResponse(errors.New("잘못된 호출"), c)
		}
	}
}

func TransactionDetail(fdb *db.FairNodeDB) echo.HandlerFunc {
	return func(c echo.Context) error {
		txHash := c.Param("hash")
		node, err := rpc.NewNodeRPC()
		if err != nil {
			return errorResponse(err, c)
		}

		defer node.Stop()
		var resp TransactionResp
		if strings.Compare("", txHash) != 0 {
			resp.Status = true
			resp.Transaction = fdb.GetTransactionDetail(txHash)
			return c.JSON(http.StatusOK, resp)
		} else {
			return errorResponse(errors.New("잘못된 호출"), c)
		}
	}
}
