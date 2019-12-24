package api

import (
	"errors"
	"github.com/anduschain/anduschain-explorer-backend/db"
	"github.com/anduschain/anduschain-explorer-backend/service/rpc"
	"github.com/anduschain/go-anduschain/common"
	"github.com/labstack/echo"
	"net/http"
	"strings"
)

var PageRow = 25

func GetAccount(c echo.Context) error {
	addr := c.Param("account")
	node, err := rpc.NewNodeRPC()
	if err != nil {
		return errorResponse(err, c)
	}

	defer node.Stop()
	var resp AccountResp
	if strings.Compare("", addr) != 0 {
		balance, err := node.GetBalance(common.HexToAddress(addr))
		if err != nil {
			return errorResponse(err, c)
		}

		resp.Status = true
		resp.Addr = addr
		resp.Balacne = balance.String()
		return c.JSON(http.StatusOK, resp)
	} else {
		return errorResponse(errors.New("잘못된 호출"), c)
	}
}

// 최근 블록 생성 자료 조회
func Recently(fdb *db.FairNodeDB) echo.HandlerFunc {
	return func(c echo.Context) error {
		var resp RecentlyResp
		resp.Blocks, resp.Transactions = fdb.GetRecent()
		if len(resp.Blocks) != 0 {
			resp.Status = true
		}
		return c.JSON(http.StatusOK, resp)
	}
}

// 마이너 IP 리턴
func Miners(fdb *db.FairNodeDB) echo.HandlerFunc {
	return func(c echo.Context) error {
		resp := &MinerResp{}
		miners, err := fdb.GetMiners()
		if err != nil {
			return errorResponse(err, c)
		}

		for i := range miners {
			resp.IpAddr = append(resp.IpAddr, miners[i].Host)
		}

		if len(resp.IpAddr) != 0 {
			resp.Status = true
		}

		return c.JSON(http.StatusOK, resp)
	}
}
