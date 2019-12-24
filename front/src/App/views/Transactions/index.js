// base
import React, { Component } from 'react';

// components
import {
    Layout,
    Search,
    PageState,
    ContentsBox,
    TransactionsComponent,
    Pager,
    IsLoadingLayout
} from '../../components';

// assets
import './transactions.scss';

// api
import { transactionPageInfo, transactions } from "../../../api";
import {connect} from "react-redux";

class Transactions extends Component {
    state = {
        loading : false,
        network : this.props.network,
        currentPage : 0,
        txPageInfo : {
            status : false,
            pageTotalNum : 0,
            pageRow : 0,
            totalCount : 0,
        },
        transactions : [],
    };

    getTransactionsPage = async (page) => {
        this.setState({loading : true});
        try {
            let res = await transactions(this.state.network, page);
            if (res.status === 200) {
                this.setState({
                    transactions : res.data.transactions,
                    loading : false,
                })
            }
        }catch (e) {
            console.log(e);
            this.setState({loading : false,})
        }

    };

    getTransactionPageInfo = async () => {
        try{
            let res = await transactionPageInfo(this.state.network);
            if (res.status === 200) {
                let {status, pageTotalNum, pageRow, totalCount} = res.data;
                if (status) {
                    this.setState({
                        txPageInfo : {status, pageTotalNum, pageRow, totalCount},
                        currentPage : 1
                    });
                }
            }
        }catch (e) {
            console.log(e);
        }

    };

    movePage = (div) => {
        const { pageTotalNum } = this.state.txPageInfo;
        if(div==='prv'){
            if(this.state.currentPage > 1) {
                this.props.history.push(`/transactions/${Number(this.state.currentPage)-1}`);

            }
        }else if(div==='next'){
            if(this.state.currentPage < pageTotalNum) {
                this.props.history.push(`/transactions/${Number(this.state.currentPage)+1}`);
            }
        }
    };

    componentDidMount() {
       this.getTransactionPageInfo();
        this.getTransactionsPage(1);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentPage !== this.state.currentPage) {
            this.getTransactionsPage(this.state.currentPage)
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.currentPage !== nextProps.match.params.page) {
            return { currentPage : Number(nextProps.match.params.page)}
        }
        return null
    }

    render() {
        return (
            <Layout>
                <main className="transaction">
                    <div className="l-wrapper">
                        <div className="page_upper">
                            <Search />
                            <PageState pageName="Transactions" />
                        </div>
                        {
                            !this.state.loading && this.state.txPageInfo.status ? (
                                <ContentsBox>
                                    <TransactionsComponent transactions={this.state.transactions}/>
                                    <div className="transactions_pager">
                                        <Pager
                                            currentPage={this.state.currentPage}
                                            totalnum={ this.state.txPageInfo.pageTotalNum}
                                            movepage={this.movePage}
                                        />
                                    </div>
                                </ContentsBox>
                            ) : (
                                <ContentsBox>
                                    <IsLoadingLayout isLoading={true}/>
                                </ContentsBox>
                            )
                        }

                    </div>
                </main>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        network : state.appState.network,
    }
};

const mapDispatchToProps = (dispatch) => ({

});


export default connect(mapStateToProps, mapDispatchToProps)(Transactions);

