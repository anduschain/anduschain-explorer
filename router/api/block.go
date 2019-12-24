package api

import (
	"errors"
	"github.com/anduschain/anduschain-explorer-backend/db"
	"github.com/labstack/echo"
	"net/http"
	"strconv"
	"strings"
)

// 최신 블록 100개 리턴 (그래프용)
func RecentBlocks(fdb *db.FairNodeDB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var resp RecentBlocksResp
		resp.Blocks = fdb.GetRecentBlocks()
		if len(resp.Blocks) > 0 {
			resp.Status = true
		}
		return c.JSON(http.StatusOK, resp)
	}
}

// page total num
func Blocks(fdb *db.FairNodeDB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var resp PageNumResp
		cnt, err := fdb.GetBlockTotalCount()
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
	}
}

func BlocksPage(fdb *db.FairNodeDB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var page int64 = 0
		var resp BlocksResp
		p := c.Param("page")
		if strings.Compare("", p) != 0 {
			page, _ = strconv.ParseInt(p, 10, 64)
			resp.Blocks = fdb.GetBlocks(int(page), PageRow)
			if len(resp.Blocks) > 0 {
				resp.Status = true
			}
			return c.JSON(http.StatusOK, resp)
		} else {
			return errorResponse(errors.New("잘못된 호출"), c)
		}
	}
}

func BlockDetail(fdb *db.FairNodeDB) echo.HandlerFunc {
	return func(c echo.Context) error {
		p := c.Param("number")
		var resp BlockDetailResp
		blockNum, _ := strconv.ParseInt(p, 10, 64)
		if strings.Compare("", p) != 0 {
			err, block := fdb.GetBlockDetail(blockNum)
			if err != nil {
				return c.JSON(http.StatusOK, resp)
			}
			resp.Status = true
			resp.Block = *block

			return c.JSON(http.StatusOK, resp)
		} else {
			return errorResponse(errors.New("잘못된 호출"), c)
		}
	}
}

func BlockTxList(fdb *db.FairNodeDB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var page int64 = 0
		var resp TransctsionsResp
		n := c.Param("number")
		p := c.Param("page")
		if strings.Compare("", p) != 0 {
			page, _ = strconv.ParseInt(p, 10, 64)
			blockNum, _ := strconv.ParseInt(n, 10, 64)

			resp.Txs = fdb.GetTransactions(int64(PageRow), page, blockNum)
			if len(resp.Txs) > 0 {
				resp.Status = true
			}

			return c.JSON(http.StatusOK, resp)
		} else {
			return errorResponse(errors.New("잘못된 호출"), c)
		}
	}
}

const (
	TRANSFER = 0
	JOINTX   = 1
	CONTRACT = 2
)

func BlockTransaction(fdb *db.FairNodeDB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var page int64 = 0
		var resp TransctsionsResp
		n := c.Param("number")
		t := c.Param("type")
		p := c.Param("page")
		if strings.Compare("", p) != 0 {
			page, _ = strconv.ParseInt(p, 10, 64)
			blockNum, _ := strconv.ParseInt(n, 10, 64)

			var txType int // 0 : transfer
			switch t {
			case "transfer":
				txType = TRANSFER
				break;
			case "jointx":
				txType = JOINTX
				break
			case "contract":
				txType = CONTRACT
				break
			default:
				return errorResponse(errors.New("잘못된 호출"), c)
			}

			resp.Txs = fdb.GetTransactionByType(int64(PageRow), page, blockNum, txType)
			if len(resp.Txs) > 0 {
				resp.Status = true
			}

			return c.JSON(http.StatusOK, resp)
		} else {
			return errorResponse(errors.New("잘못된 호출"), c)
		}
	}
}
