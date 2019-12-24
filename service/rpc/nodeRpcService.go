package rpc

import (
	"context"
	"github.com/anduschain/anduschain-explorer-backend/config"
	"github.com/anduschain/go-anduschain/common"
	"github.com/anduschain/go-anduschain/core/types"
	"github.com/anduschain/go-anduschain/ethclient"
	"math/big"
)

type NodeRPC struct {
	clinet *ethclient.Client
}

func NewNodeRPC() (*NodeRPC, error) {
	client, err := ethclient.Dial(config.GetNode_WSRPC_EndPoint())
	if err != nil {
		return nil, err
	}

	nr := &NodeRPC{client}

	return nr, nil
}

func (rc *NodeRPC) GetNewBlockEvent(headerCh chan *types.Header, errCh chan error, exit chan struct{}) {
	client := rc.clinet
	newHeader := make(chan *types.Header)
	sub, err := client.SubscribeNewHead(context.Background(), newHeader)
	if err != nil {
		errCh <- err
		return
	}
	for {
		select {
		case err := <-sub.Err():
			errCh <- err
			return
		case header := <-newHeader:
			headerCh <- header
		case <-exit:
			return
		}
	}
}

func (rc *NodeRPC) GetBalance(addr common.Address) (*big.Int, error) {
	return rc.clinet.BalanceAt(context.Background(), addr, nil)
}

func (rc *NodeRPC) GetBlock(blockHash common.Hash) (*types.Block, error) {
	client := rc.clinet
	return client.BlockByHash(context.Background(), blockHash)
}

func (rc *NodeRPC) GetTransaction(txhash common.Hash) (*types.Transaction, bool, error) {
	client := rc.clinet
	return client.TransactionByHash(context.Background(), txhash)
}

func (rc *NodeRPC) Stop() {
	rc.clinet.Close()
}
