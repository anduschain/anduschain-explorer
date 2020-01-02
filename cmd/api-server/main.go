package main

import (
	"fmt"
	"github.com/anduschain/anduschain-explorer/config"
	"github.com/anduschain/anduschain-explorer/router"
	"os"
	"os/signal"
	"syscall"
)

func main() {

	err := config.ReadConfig()
	if err != nil {
		fmt.Println(err)
	}

	rot, err := router.NewRouter()
	if err != nil {
		fmt.Println("Server new Error ", err)
		return
	}
	go func() {
		if err := rot.Start(); err != nil {
			rot.Echo.Logger.Info("shutting down the server")
		}
	}()

	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt, os.Kill, syscall.SIGINT, syscall.SIGTERM)
	defer signal.Stop(sigc)
	<-sigc
	rot.Stop()
}
