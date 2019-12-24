// base
import React, { Component } from 'react';

// components
import { Layout, Search, PageState, ContentsBox, TransactionsComponent, AccountOverview, Pager, IsLoadingLayout } from '../../components';

// assets
import './account.scss';

import {accountDetail, accountTransactionList, accountTransactionDetail} from '../../../api';
import {connect} from "react-redux";

class Account extends Component {
    state = {
        network : this.props.network,
        loading : false,
        address : null,
        balance : 0,
        currentPage : 0,
        pageInfo : {
            status : false,
            pageTotalNum : 0,
            pageRow : 0,
            totalCount : 0,
        },
        transactions : [],
    };

    getBlocksPage = async (page) => {
        this.setState({loading : true, transactions : []});
        try{
            const {address} = this.state;
            let res = await accountTransactionDetail(this.state.network, address, page);
            if (res.status === 200) {
                this.setState({
                    transactions : res.data.transactions ? res.data.transactions : [],
                    loading : false,
                })
            }
        }catch (e) {
            console.log(e);
            this.setState({loading : false});
        }

    };


    getAccoutInfo = async (address) => {
        try{
            let res = await accountDetail(this.state.network , address);
            if(res.status === 200){
                this.setState({
                    address : res.data.address,
                    balance : res.data.balance
                })
            }
        }catch (e) {
            console.log(e);
        }

    };

    getAccountPageInfo = async (address) => {
        try{
            let res = await accountTransactionList(this.state.network, address);
            if (res.status === 200) {
                let {status, pageTotalNum, pageRow, totalCount} = res.data;
                this.setState({
                    pageInfo : {status, pageTotalNum, pageRow, totalCount},
                    currentPage : status ? 1 : 0,
                });
            }
        }catch (e) {
            console.log(e)
        }

    };

    componentDidMount() {
        const {address} = this.props.match.params;
        this.getAccountPageInfo(address);
        this.getAccoutInfo(address);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentPage !== this.state.currentPage) {
            this.getBlocksPage(this.state.currentPage)
        }

        if (prevState.address !== this.state.address) {
            this.getAccountPageInfo(this.state.address);
            this.getAccoutInfo(this.state.address);
            this.getBlocksPage(this.state.currentPage)
        }
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.address !== nextProps.match.params.address) {
            return { address : nextProps.match.params.address }
        }
        return null
    }

    movePage =(div) =>{
        const {currentPage, pageInfo} = this.state;
        if(div ==='prv'){
            if(currentPage > 1) {
                this.setState({currentPage : currentPage - 1})
            }
        }else if(div === 'next'){
            if(currentPage < pageInfo.pageTotalNum) {
                this.setState({currentPage: currentPage + 1})
            }
        }
    };

  render() {
    const {address, balance, currentPage, pageInfo, transactions} = this.state;

    return (
      <Layout>
        <main className="Account">
          <div className="l-wrapper">
            <div className="page_upper">
              <Search />
              <PageState pageName="Account" hash={address} />
            </div>
            <div className="account_contents_group">
              <div className="account_col">
                <ContentsBox title="Overview">
                  <AccountOverview address={address} balance={balance} totalTx={pageInfo ? pageInfo.totalCount : 0}/>
                </ContentsBox>
              </div>
              <div className="account_col">
                  {
                      !this.state.loading ? (
                          <ContentsBox title="Transactions">
                              <TransactionsComponent pageName={'Account'} transactions={transactions}/>
                              <div className="transactions_pager">
                                  <Pager currentPage={currentPage} totalnum={pageInfo.pageTotalNum} movepage={this.movePage}/>
                              </div>
                          </ContentsBox>
                      ) : (
                          <ContentsBox title="Transactions">
                            <IsLoadingLayout isLoading={true}/>
                          </ContentsBox>
                      )
                  }
              </div>
            </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(Account);
