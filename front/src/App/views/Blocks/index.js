// base
import React, { Component } from 'react';

// components
import { Layout, PageState, Search, Pager, ContentsBox, BlocksComponent, IsLoadingLayout } from '../../components';

// assets
import './blocks.scss';
import {blocks, blockpageinfo} from "../../../api";
import { connect } from 'react-redux';

class Blocks extends Component {

    state = {
        loading : false,
        network : this.props.network,
        currentPage : 0,
        blockPageInfo : {
            status : false,
            pageTotalNum : 0,
            pageRow : 0,
            totalCount : 0,
        },
        blocks : [],
    };

    getBlocksPage = async (page) => {
        this.setState({loading : true});
        try {
            let res = await blocks(this.state.network, page);
            if (res.status === 200) {
                this.setState({
                    blocks : res.data.blocks,
                    loading : false
                })
            }
        }catch (e) {
            console.log(e);
            this.setState({loading : false});
        }
    };

    getBlocksPageInfo = async () => {
        try{
            let res = await blockpageinfo(this.state.network);
            if (res.status === 200) {
                let {status, pageTotalNum, pageRow, totalCount} = res.data;
                if (status) {
                    this.setState({
                        blockPageInfo : {status, pageTotalNum, pageRow, totalCount},
                        currentPage : 1
                    });
                }
            }
        }catch (e) {
            console.log(e);
        }
    };

    movePage =(div) =>{
        const { pageTotalNum } = this.state.blockPageInfo;
        if(div === 'prv'){
            if(this.state.currentPage > 1) {
                this.props.history.push(`/blocks/${Number(this.state.currentPage)-1}`);
            }
        }else if(div === 'next'){
            if(this.state.currentPage < pageTotalNum) {
                this.props.history.push(`/blocks/${Number(this.state.currentPage)+1}`);
            }
        }
    };

    componentDidMount() {
        this.getBlocksPageInfo();
        this.getBlocksPage(1);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentPage !== this.state.currentPage) {
            this.getBlocksPage(this.state.currentPage)
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.currentPage !== nextProps.match.params.number) {
            return { currentPage : Number(nextProps.match.params.number)}
        }
        return null
    }


    render() {
        return (
            <Layout>
                <main className="Blocks">
                    <div className="l-wrapper">
                        <div className="page_upper">
                            <Search />
                            <PageState pageName="Blocks" />
                        </div>
                        {
                            !this.state.loading && this.state.blockPageInfo.status ? (
                                <ContentsBox>
                                    <BlocksComponent blocks={this.state.blocks}/>
                                    <div className="Blocks_pager">
                                        <Pager currentPage={this.state.currentPage} totalnum={this.state.blockPageInfo.pageTotalNum} movepage={this.movePage}/>
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


export default connect(mapStateToProps, mapDispatchToProps)(Blocks);
