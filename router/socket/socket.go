package socket

import (
	"errors"
	"github.com/anduschain/anduschain-explorer/db"
	"github.com/anduschain/anduschain-explorer/db/schema"
	"github.com/anduschain/anduschain-explorer/router/api"
	"github.com/anduschain/anduschain-explorer/service/rpc"
	"github.com/anduschain/go-anduschain/core/types"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
	"net/http"
	"strings"
)

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func getMinersIP(fdb *db.FairNodeDB) []string {
	var res []string
	miners, err := fdb.GetMiners()
	if err != nil {
		return []string{}
	}
	for i := range miners {
		res = append(res, miners[i].Host)
	}
	return res
}

func wsErrorResponse(ws *websocket.Conn, err error) {
	var resp api.WsErrResponse
	resp.Code = "error"
	resp.Msg = err.Error()
	ws.WriteJSON(&resp)
}

func HeaderEventSocket(fdb *db.FairNodeDB, node *rpc.NodeRPC) echo.HandlerFunc {
	return func(c echo.Context) error {
		ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
		if err != nil {
			return c.JSON(http.StatusForbidden, err)
		}

		defer ws.Close()

		headerCh := make(chan *types.Header)
		exit := make(chan struct{})
		errch := make(chan error)

		// 최초 접속 데이터 전송
		var resp api.WsResponse
		resp.Status = true
		resp.Code = "init"
		resp.Blocks, resp.Transactions = fdb.GetRecent()
		resp.GBlocks = fdb.GetRecentBlocks()
		resp.IpAddr = getMinersIP(fdb)
		if err := ws.WriteJSON(&resp); err != nil {
			wsErrorResponse(ws, err)
			errch <- err
		}

		go node.GetNewBlockEvent(headerCh, errch, exit)
		go func() {
			for {
				select {
				case header := <-headerCh:
					var resp api.WsRespHeader
					resp.Status = true
					resp.Code = "header"
					resp.Block = schema.RespBlock{
						header.Hash().String(),
						header.Time.String(),
						header.Number.Uint64(),
						header.Difficulty.String(),
					}

					if err := ws.WriteJSON(&resp); err != nil {
						wsErrorResponse(ws, err)
					}

				case <-errch:
					return
				}
			}
		}()

		for {
			_, message, err := ws.ReadMessage()
			if err != nil {
				errch <- err
				exit <- struct{}{}
				return err
			}

			if strings.Compare(string(message), "exit") == 0 {
				err := ws.WriteMessage(websocket.CloseMessage, nil)
				if err != nil {
					errch <- err
					exit <- struct{}{}
					return err
				}
				return errors.New("websocket close from client")
			}
		}
	}
}
