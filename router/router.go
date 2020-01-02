package router

import (
	"fmt"
	"github.com/anduschain/anduschain-explorer/config"
	"github.com/anduschain/anduschain-explorer/db"
	"github.com/anduschain/anduschain-explorer/router/api"
	"github.com/anduschain/anduschain-explorer/router/socket"
	"github.com/anduschain/anduschain-explorer/service"
	"github.com/anduschain/anduschain-explorer/service/rpc"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"net/http"
)

type Router struct {
	Echo      *echo.Echo
	dbSession *db.FairNodeDB
	rpcNode   *rpc.NodeRPC
}

func NewRouter() (*Router, error) {
	e := echo.New()
	e.Debug = true
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.Gzip())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: config.Conf.CORSAllowOrigins,
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAcceptEncoding},
	}))

	e.HTTPErrorHandler = service.JSONHTTPErrorHandler

	fairDb, err := db.NewSession()
	if err != nil {
		return nil, err
	}

	// node ws-rpc
	node, err := rpc.NewNodeRPC()
	if err != nil {
		return nil, err
	}

	e.Static("/", "front/build")

	test := e.Group("/api-test")
	{
		test.GET("", func(c echo.Context) error {
			resp := struct {
				api.Response
				Result []string `json:"result"`
			}{}

			resp.Status = true
			for i := 0; i < 100; i++ {
				resp.Result = append(resp.Result, "api-test")
			}

			return c.JSON(http.StatusOK, resp)
		})
	}

	apiG := e.Group("/api")
	{
		anduschainNet := apiG.Group("/anduschain")
		{
			anduschainNet.GET("/recently", api.Recently(fairDb))
			anduschainNet.GET("/miners", api.Miners(fairDb))
			anduschainNet.GET("/recentblocks", api.RecentBlocks(fairDb))

			anduschainNet.GET("/blocks", api.Blocks(fairDb))
			anduschainNet.GET("/blocks/:page", api.BlocksPage(fairDb))
			anduschainNet.GET("/block/:number", api.BlockDetail(fairDb))
			anduschainNet.GET("/block/:number/:page", api.BlockTxList(fairDb))
			anduschainNet.GET("/block/:number/:type/:page", api.BlockTransaction(fairDb))

			anduschainNet.GET("/account/:account", api.GetAccount)

			anduschainNet.GET("/transactions", api.Transactions(fairDb))
			anduschainNet.GET("/transactions/:page", api.GetTransactions(fairDb))
			anduschainNet.GET("/transactions/account/:account", api.TxsAccount(fairDb))
			anduschainNet.GET("/transactions/account/:account/:page", api.GetTxsAccount(fairDb))
			anduschainNet.GET("/transaction/:hash", api.TransactionDetail(fairDb))
		}

		ws := apiG.Group("/ws")
		{
			ws.GET("/anduschain", socket.HeaderEventSocket(fairDb, node)) // websocket
		}
	}

	return &Router{Echo: e, dbSession: fairDb, rpcNode: node}, nil
}

func (r *Router) Start() error {
	var err error
	err = r.dbSession.Start()
	if err != nil {
		return err
	}

	err = r.Echo.Start(fmt.Sprintf(":%s", config.GetServerPort()))
	if err != nil {
		return err
	}

	return nil
}

func (r *Router) Stop() {
	r.Echo.Logger.Info("server close")
	r.dbSession.Stop()
	r.rpcNode.Stop()
	r.Echo.Close()
}
