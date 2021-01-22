package config

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"
	"time"
)

type Config struct {
	DbConnInfo          DBConnInfo    `json:"db_conn_info"`
	Port                string        `json:"serverport"`
	Node_WSRPC_EndPoint string        `json:"node_wsrpc_endpoint"`
	JoinTxAddress       string        `json:"jointx_address"`
	CORSAllowOrigins    []string      `json:"cors_allow_origins"`
	DbTimeOut           time.Duration `json:"db_time_out"`
}

type DBConnInfo struct {
	Protocol string `json:"protocol"`
	User     string `json:"user"`
	Password string `json:"password"`
	Dbname   string `json:"dbname"`
	Host     string `json:"host"`
	DbOption string `json:"dboption"`
}

var (
	DBConnUrl string
	Conf      Config
)

func ReadConfig() error {
	configFile, ok := os.LookupEnv("ANDUS_EXPLORER_CONFIG")
	if !ok {
		return errors.New("check system environment(export ANDUS_EXPLORER_CONFIG=<configfile>)")
	}
	data, err := ioutil.ReadFile(configFile)
	if err != nil {
		log.Fatal("read file failed: ", err)
		return err
	}
	if err := json.Unmarshal(data, &Conf); err != nil {
		log.Fatal("json unmarshalling failed: ", err)
		return err
	}

	fmt.Println("CORSAllowOrigins : ", len(Conf.CORSAllowOrigins))
	for idx, ao := range Conf.CORSAllowOrigins {
		fmt.Printf("[%d] CORSAllowOrigins : %s\n", idx, ao)
	}

	var userPass, dbName, dbOpt string
	if strings.Compare(Conf.DbConnInfo.User, "") != 0 {
		userPass = fmt.Sprintf("%s:%s@", Conf.DbConnInfo.User, Conf.DbConnInfo.Password)
	}
	if strings.Compare(Conf.DbConnInfo.Dbname, "") != 0 {
		dbName = fmt.Sprintf("%s", Conf.DbConnInfo.Dbname)
	}
	if strings.Compare(Conf.DbConnInfo.DbOption, "") != 0 {
		dbOpt = fmt.Sprintf("?%s", Conf.DbConnInfo.DbOption)
	}
	DBConnUrl = fmt.Sprintf("%s://%s%s/%s%s", Conf.DbConnInfo.Protocol, userPass, Conf.DbConnInfo.Host, dbName, dbOpt)

	fmt.Println("Successfully read a config file")
	return nil
}

func GetDBName() string {
	return Conf.DbConnInfo.Dbname
}

func GetServerPort() string {
	return Conf.Port
}

func GetNode_WSRPC_EndPoint() string {
	return Conf.Node_WSRPC_EndPoint
}

func GetJoinTxAddress() string {
	return Conf.JoinTxAddress
}
