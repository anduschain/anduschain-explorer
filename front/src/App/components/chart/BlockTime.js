// base
import React, {Component} from 'react';
import {BarChart, Bar, ResponsiveContainer, Cell} from 'recharts';

import {timeDiff} from '../../../helper'

// assets
import './blockTime.scss';

class BlockTime extends Component {

    state = {
        // least: null,
        // prv: null,
        dataLength : 0,
        currentBlock: 0,
        countTime: 0,
        blockTime: 0,
    };

    setCount = () => {
        this.setState({
            countTime: this.state.countTime + 1
        })
    };

    static getDerivedStateFromProps(props, state) {
        // console.log(props.gData.length)
        if (props.gData.length > 0) {
            if (props.gData[0].number !== state.currentBlock) {
                return {
                    currentBlock: props.gData[0].number,
                    blockTime: timeDiff(props.gData[1].timestamp, props.gData[0].timestamp),
                    countTime: 0,
                }
            }
            if (props.gData.length !== state.dataLength) {
                return {
                    // prv: props.gData[1],
                    // least: props.gData[0],
                    dataLength: props.gData.length,
                    currentBlock: props.gData[0].number,
                    countTime: 0,
                    blockTime: timeDiff(props.gData[1].timestamp, props.gData[0].timestamp),
                }
            }
        }
        // console.log("no update")
        return null;
    };

    // componentWillReceiveProps(nextProps) {
    //     console.log('componentWillReceiveProps');
    //     console.log(nextProps);
    //     if (nextProps.gData.length > 0) {
    //         if (this.state.currentBlock !== nextProps.gData[0].number) {
    //             this.setState({
    //                 currentBlock: nextProps.gData[0].number,
    //                 blockTime: timeDiff(nextProps.gData[1].timestamp, nextProps.gData[0].timestamp),
    //                 countTime: 0,
    //             });
    //         }
    //
    //         if (this.props.gData.length !== nextProps.gData.length) {
    //             this.setState(
    //                 {
    //                     prv: nextProps.gData[1],
    //                     least: nextProps.gData[0],
    //                     currentBlock: nextProps.gData[0].number,
    //                     blockTime: timeDiff(nextProps.gData[1].timestamp, nextProps.gData[0].timestamp),
    //                     countTime: 0,
    //                 }
    //             )
    //         }
    //     }
    // }

    componentDidMount() {
        this.countInterval = setInterval(this.setCount, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.countInterval)
    }

    render() {
        // if (this.props.gData.length = 0) return null;
        return (
            <div className="BlockTime">
                <section className="upper">
                    <div className="blockTime_avg">
                        <p className="blockTime_title">
                            Current block
                        </p>
                        <p className="blockTime_number">
                            {this.state.currentBlock}
                            <small></small>
                        </p>
                    </div>
                    {/*블록 들어올대마다 1초씩 늘어가게*/}
                    <div className="blockTime_personal">
                        <p className="blockTime_title">
                            Since latest block
                        </p>
                        <p className="blockTime_number">
                            {this.state.countTime}
                            <small>ago</small>
                        </p>
                    </div>
                    <div className="blockTime_personal">
                        <p className="blockTime_title">
                            block time
                        </p>
                        <p className="blockTime_number">
                            {this.state.blockTime}
                            <small>sec</small>
                        </p>
                    </div>
                </section>
                <ResponsiveContainer width="100%" height={100}>
                    <BarChart data={this.props.gData}>
                        <Bar
                            dataKey="diffculty"
                            barSize={6}
                            maxBarSize={6}
                            fill="#9CD4FF"
                            minPointSize={10} // 높이 최소값
                        >
                            {
                                this.props.gData.length > 0 &&
                                this.props.gData.map((entry, index) => (
                                    <Cell key={`cell-${index}`}
                                          fill={index === (this.props.gData.length - 1) ? '#0492ff' : '#9CD4FF'}/>
                                ))
                            }
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }
};

BlockTime.defaultProps = {
    gData: [],
};

export default BlockTime