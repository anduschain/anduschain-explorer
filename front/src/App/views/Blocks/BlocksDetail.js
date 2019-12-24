// base
import React, {Component} from 'react';

// components
import {
    Layout, PageState, Search, ContentsBox,
    BlocksOverview, BlocksVoter, TransactionsComponent, Pager
} from '../../components';

// assets
import './blocksDetail.scss';
import {blockDetail, blockDetailTxList} from "../../../api";

class BlocksDetail extends Component {

    TRANSFER = 0;
    JOINTX = 1;
    CONTRACT = 2;

    state = {
        network: "testnet",
        block: {
            hash: "",
            header: {},
            txCnt: 0,
            eachTxCnt: [0, 0, 0], //0 : transfer, 1: jointx, 2: contract
            voter: [],
        },
        pageTotal: 0,
        transactions: [],
        txType: 0,
        page: [1, 1, 1], //0 : transfer, 1: jointx, 2: contract
    };

    getBlockDetail = async (number) => {
        let res = await blockDetail(this.state.network, number);
        if (res.data.status) {
            const {Hash, TxCnt, EachTxCnt, Header, Voter} = res.data.Block;
            this.setState({
                block: {
                    hash: Hash,
                    header: Header,
                    voter: Voter,
                    txCnt: TxCnt,
                    eachTxCnt: EachTxCnt,
                },
                pageTotal: Math.floor(TxCnt / 25),
            });
            this.props.history.push(`/blocks/detail/${number}`);
        } else {
            this.props.history.push(`/`);
        }
    };

    //txType : 0(transfer), 1(jointx), 2(contract)
    getTransactionsPage = async (txType, page) => {
        let txTypeName = '';
        switch (txType) {
            case this.TRANSFER:
                txTypeName = 'transfer';
                break;
            case this.JOINTX:
                txTypeName = 'jointx';
                break;
            case this.CONTRACT:
                txTypeName = 'contract';
                break;
            default:
                console.log("Unvalid transaction type");
                break;
        }

        const {network, block} = this.state;

        try {
            let res = await blockDetailTxList(network, block.header.number, txTypeName, page);
            if (res.status === 200) {
                let arr = [...this.state.page];
                arr[txType] = page;
                let pt = Math.ceil(block.eachTxCnt[txType] / 25);
                pt = (pt === 0) ? 1 : pt;
                this.setState({
                    transactions: res.data.transactions,
                    pageTotal: pt,
                    page: arr,
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    tabOnSelect = async (index) => {
        this.setState({
            txType: index
        });
        await this.getTransactionsPage(index, this.state.page[index])
    };

    async componentDidMount() {
        const {number} = this.props.match.params;
        await this.getBlockDetail(number);
        await this.getTransactionsPage(this.TRANSFER, this.state.page[this.TRANSFER]);
    }

    movePage = async (div) => {
        try {
            const {txType, page, pageTotal} = this.state;
            if (div === 'prv') {
                if (page[txType] > 1) {
                    await this.getTransactionsPage(txType, page[txType] - 1)
                }
            } else if (div === 'next') {
                if (page[txType] < pageTotal) {
                    await this.getTransactionsPage(txType, page[txType] + 1)
                }
            }
        } catch (e) {
            console.log(e)
        }
    };

    render() {
        const {number} = this.props.match.params;
        const {block, page, txType, transactions, pageTotal} = this.state;
        if (block.hash === "") return null;

        return (
            <Layout>
                <main className="BlocksDetail">
                    <div className="l-wrapper">
                        <div className="page_upper">
                            <Search/>
                            <PageState pageName="Blocks" block={`#${number}`}/>
                        </div>
                        <section className="BlockDetail_contents_group">
                            <div className="BlockDetail_col">
                                <ContentsBox title="Overview">
                                    <BlocksOverview block={block} totTx/>
                                </ContentsBox>
                            </div>
                            <div className="BlockDetail_col">
                                <ContentsBox title={`Voter(${block.voter.length})`}>
                                    <BlocksVoter blockVoter={block.voter}/>
                                </ContentsBox>
                            </div>
                            <div className="BlockDetail_col">
                                <ContentsBox title="Transactions">
                                    <TransactionsComponent transactions={transactions} tabOnSelect={this.tabOnSelect}
                                                           tab={true}/>
                                    <div className="transactions_pager">
                                        <Pager
                                            currentPage={page[txType]}
                                            totalnum={pageTotal}
                                            movepage={this.movePage}
                                        />
                                    </div>
                                </ContentsBox>
                            </div>
                        </section>
                    </div>
                </main>
            </Layout>
        )
    }
}

export default BlocksDetail
