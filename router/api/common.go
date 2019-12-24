package api

import (
	"errors"
	"github.com/labstack/echo"
	"net/http"
)

func errorResponse(err error, c echo.Context) error {
	resp := &ErrResp{}
	resp.Status = false

	if c.Echo().Debug {
		resp.Msg = err.Error()
		return c.JSON(http.StatusInternalServerError, resp)
	} else {
		resp.Msg = errors.New("내부 서버 에러").Error()
		return c.JSON(http.StatusInternalServerError, resp)
	}
}
