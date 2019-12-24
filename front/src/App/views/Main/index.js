// base
import React, {Component} from 'react';

// assets
import './main.scss';
import icon_viewAll from '../../assets/images/common/icon-viewall.png';

// components
import {
    Layout, PageState, Search, ContentsBox, Button,
    BlockTime, BlocksComponent, TransactionsComponent, Responsive
} from '../../components';

// api
import {miners, getLoca, recently} from '../../../api'
import con from '../../../constants'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import produce from "immer";
import {mainnet, testnet, devnet} from '../../../modules/appState'

class Main extends Component {
    state = {
        locations: [],
        blocks: [],
        txs: [],
        recentBlocks: [],
    };

    getMiners = async () => {
        try {
            let res = await miners(this.props.network);
            if (res.status === 200) {
                this.getLocation(res.data.ipaddr)
            }
        } catch (e) {
            console.log(e)
        }

    };

    getRecent = async () => {
        try {
            let res = await recently(this.props.network);
            if (res.status === 200) {
                let txs = res.data.transactions;
                this.setState({
                    blocks: res.data.blocks,
                    txs: txs.length > 10 ? txs.slice(0, 10) : txs,
                })
            }
        } catch (e) {
            console.log(e)
        }

    };

    getLocation = async (ipAddr) => {
        let loc = [];
        if (ipAddr && ipAddr.length > 0) {
            for (let i = 0; i < ipAddr.length; i++) {
                let re = await getLoca(ipAddr[i]);
                if (re.status === 200) {
                    loc.push(re.data)
                }
            }
        }
        if (loc.length !== 0) {
            this.setState({
                locations: loc
            })
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.network !== prevProps.network) {
            this.openWebSocket();
        }
    };

    componentDidMount() {
        this.openWebSocket();
    }

    openWebSocket = () => {
        this.closeWebSocket();
        this.webSock = new WebSocket(con.WS_URL(this.props.network));
        this.webSock.onmessage = (event) => {
            switch (event.type) {
                case "message" :
                    let e = JSON.parse(event.data);
                    if (e.code === "init") {
                        this.getLocation(e.ipaddr);
                        this.setState(produce(draft => {
                            draft.blocks = e.blocks;
                            draft.recentBlocks = e.gBlocks;
                            draft.txs = e.transactions.length > 9 ? e.transactions.slice(0, 10) : e.transactions;
                        }));
                    } else if (e.code === "header") {
                        this.setState(produce(draft => {
                            draft.recentBlocks.unshift(e.block);
                        }));
                        this.getRecent();
                    }
                    break;
                default:
                    break;
            }
        };
        this.minerInterval = setInterval(this.getMiners, 180000);
        this.heartBeatInterval = setInterval(this.getHeartBeat, 30000)
    }

    closeWebSocket = () => {
        if (this.webSock !== undefined) {
            if (this.webSock.readyState === WebSocket.OPEN || this.webSock.readyState === WebSocket.CONNECTING) {
                this.webSock.close();
                clearInterval(this.minerInterval);
                clearInterval(this.heartBeatInterval);
            }
        }
    }

    getHeartBeat = () => {
        if (this.webSock.readyState !== 0) {
            this.webSock.send("heartbeat")
        }
    }

    componentWillUnmount() {
        this.closeWebSocket();
    }

    render() {
        const ViewDetailBtn = (props) => (
            <div className="main_button_wrapper">
                <Button color="black" link={props.Link}>
                    <img src={icon_viewAll} alt="전체보기"/>
                    VIEW ALL
                </Button>
            </div>
        );

        const {recentBlocks, locations} = this.state;

        return (
            <Layout>
                <main className="mainView">
                    <div className="l-wrapper">
                        <div className="page_upper">
                            <Search/>
                            <PageState pageName="AndUsChain Explorer" pageNetwork={this.props.network}/>
                        </div>
                        <div className="main_contents_group">
                            <div className="main_col blockTime">
                                <div className="blockTime_wrapper">
                                    <BlockTime network={this.props.network} gData={recentBlocks}/>
                                </div>
                            </div>
                            <div className="main_col geography">
                                <div className="geography_wrapper">
                                    <p className="geography_title">Active Miner</p>
                                    <div className="geography_map_wrapper">
                                        <Responsive data={locations}/>
                                    </div>
                                </div>
                            </div>
                            <div className="main_col blocks">
                                <ContentsBox title="Recent Blocks">
                                    <BlocksComponent blocks={this.state.blocks} type="simple"/>
                                    <ViewDetailBtn Link={"/blocks/1"}/>
                                </ContentsBox>
                            </div>
                            <div className="main_col transaction">
                                <ContentsBox title="Recent Transaction">
                                    <TransactionsComponent transactions={this.state.txs} type="simple"/>
                                    <ViewDetailBtn Link={"/transactions/1"}/>
                                </ContentsBox>
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
        network: state.appState.network,
    }
};

const mapDispatchToProps = (dispatch) => ({
    changeMainnet: bindActionCreators(mainnet, dispatch),
    changeTestnet: bindActionCreators(testnet, dispatch),
    changeDevnet: bindActionCreators(devnet, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(Main);
