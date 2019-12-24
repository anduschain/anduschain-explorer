import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {mainnet, testnet, devnet} from "../../../modules/appState";
import {connect} from "react-redux";
import './dropdown.css'
import {header_arrow, header_network} from '../../assets/images/header';


class Dropdown extends Component {

    state = {
        open: false
    }

    handleSelects = (e) => {
        this.setOpen();
        if (this.openTimeout) {
            clearTimeout(this.openTimeout);
        };
        switch (e.currentTarget.dataset.key) {
            case 'devnet':
                localStorage.setItem("network", "devnet");
                this.props.changeDevnet();
                window.location.reload();
                break;
            case 'testnet':
                localStorage.setItem("network", "testnet");
                this.props.changeTestnet();
                window.location.reload();
                break;
            case 'mainnet':
                localStorage.setItem("network", "mainnet");
                this.props.changeMainnet();
                window.location.reload();
                break;
            default:
                ;
        }
    };

    setOpen = () => {
        this.setState({
            open: !this.state.open
        });

    };

    openList = () => {
        this.setOpen();
        this.openTimeout = setTimeout(this.setOpen, 3000);
    };

    componentWillUnmount() {
        clearTimeout(this.openTimeout);
    }

    getNetTitle = () => {
        switch (this.props.network) {
            case 'mainnet':
                return "MAIN Network";
                break;
            case 'testnet':
                return "TEST Network";
                break;
            default:
                return this.props.network;
        }
    }

    render() {
        // const list = [
        //     {
        //         network: "mainnet",
        //         title: "MAIN Network",
        //     },
        //     {
        //         network: "testnet",
        //         title: "TEST Network",
        //     },
        // ];
        // if (localStorage.getItem("dev")) {
        //     list.push({
        //         network: "devnet",
        //         title: "DEV Network",
        //     })
        // }
        return (
            <div className="dd-wrapper">
                <div className="dd-header" onClick={() => this.openList()}>
                    <img src={header_network} alt="network 선택"/>
                    <div className="dd-header-title">{this.props.network ? this.getNetTitle() : "Select network"}</div>
                    {/*{*/}
                    {/*    this.state.open ? <img style={{transform: `rotate(180deg)`}} src={header_arrow} alt="더 보기"/>*/}
                    {/*        : <img src={header_arrow} alt="더 보기"/>*/}
                    {/*}*/}
                </div>
                {/*{*/}
                {/*    this.state.open && */}
                {/*    <ul className="dd-list">*/}
                {/*        {*/}
                {/*        list.map((data) => (*/}
                {/*            <li className="dd-list-item"*/}
                {/*                key={data.network}*/}
                {/*                data-key={data.network}*/}
                {/*                data-title={data.title}*/}
                {/*                onClick={this.handleSelects}*/}
                {/*            >{data.title}</li>*/}
                {/*        ))}*/}
                {/*    </ul>*/}
                {/*}*/}
            </div>
        )
    }
};

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


export default connect(mapStateToProps, mapDispatchToProps)(Dropdown);


// export default Dropdown;