package service

import (
	"github.com/anduschain/anduschain-explorer/config"
	"github.com/labstack/echo"
	"net/http"
	"strings"
)

func JSONHTTPErrorHandler(err error, c echo.Context) {
	uri := strings.Split(c.Request().RequestURI, "/")
	if uri[1] == "api" {
		code := http.StatusInternalServerError
		msg := "Internal Server Error"
		if err, ok := err.(*echo.HTTPError); ok {
			code = err.Code
		}

		if !c.Response().Committed {
			if err := c.JSON(code, map[string]interface{}{
				"statusCode": code,
				"message":    msg,
			}); err != nil {
				c.Logger().Error(err)
			}
		}
	} else {
		// react router
		c.File("front/build/index.html")
	}
}

func GetTxtype(txTo string) string {
	txType := "Transfer"
	if strings.Compare(txTo, "contract") == 0 {
		txType = "Contract"
	}

	if strings.Compare(txTo, config.GetJoinTxAddress()) == 0 {
		txType = "JoinTx"
	}

	return txType
}
