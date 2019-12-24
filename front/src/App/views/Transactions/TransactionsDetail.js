// base
import React, { Component } from 'react';

// components
import {
  Layout,
  Search,
  PageState,
  ContentsBox,
  TransactionsOverview,
  TransactionsInputData,
  IsLoadingLayout
} from '../../components';

// assets
import './transactionsDetail.scss';

// api
import { transactionDetail } from "../../../api";
import {connect} from "react-redux";

class Txdetail extends Component {

  state = {
    network : this.props.network,
    transaction : {
      RT : {},
      Tx : {},
    },
  };

  getTransactionsDetail = async (hash) => {
    let res = await transactionDetail(this.state.network, hash);
    if (res.data.status && res.data.transaction !== null) {
      const {RT, Tx} = res.data.transaction;
        this.setState({
          transaction : {
            RT : RT,
            Tx : Tx,
          },
        })
    }else{
      this.props.history.push(`/`);
    }
  };

  async componentDidMount() {
    const {hash} = this.props.match.params;
    await this.getTransactionsDetail(hash);
  }

  render() {
    const {hash} = this.props.match.params;
    const { transaction } = this.state;
    const { RT, Tx } = transaction;
    return (
      <Layout>
        <main className="transactionsDetail">
          <div className="l-wrapper">
            <div className="page_upper">
              <Search />
              <PageState pageName="Transactions" hash={hash} />
            </div>
            {
              RT ? (
                  <div className="transaction_contents_group">
                    <div className="transaction_col">
                      <ContentsBox title="Overview">
                        <TransactionsOverview txData={transaction} />
                      </ContentsBox>
                    </div>
                    <div className="transaction_col">
                      <ContentsBox title="Input Data">
                        <TransactionsInputData input={Tx.Data ? Tx.Data.input : ""} />
                      </ContentsBox>
                    </div>
                  </div>
              ) : (
                  <ContentsBox title="Overview">
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

export default connect(mapStateToProps, mapDispatchToProps)(Txdetail);
