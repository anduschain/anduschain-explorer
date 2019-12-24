// base
import React from 'react';
import {Link} from 'react-router-dom';

// components
import {Button} from '..';
// assets
import arrow from '../../assets/images/transactions/arrow.png';
import './transactionsComponentTable.scss'
import {substring, fromNow, wei2Daon} from '../../../helper';


const TransactionsComponentTable = ({props}) => {
    if (!props) return null
    let tx = props.transactions
    return (
        <table className={`table_type01 transactions_table ${props.type === 'simple' && 'simple'}`}>
            <thead>
            <tr>
                <th>TX HASH</th>
                {
                    props.type !== 'simple' && <th>BLOCK #</th>
                }
                <th>TX TYPE</th>
                <th>FROM</th>
                <th>
                    <img src={arrow} alt="에서"/>
                </th>
                <th>TO</th>
                {
                    props.type !== 'simple' && <th>TIME</th>
                }
                {
                    props.type !== 'simple' && <th>AMOUNT<br/>(TEST_DAON)</th>
                }
                {
                    props.type !== 'simple' && <th>TX FEE<br/>(TEST_DAON)</th>
                }
            </tr>
            </thead>

            <tbody>
            {
                tx && tx.length > 0 &&
                tx.map((item, index) => (
                    <tr key={index}>
                        <td>
                            <Button color="blue" size="wide" link={`/transaction/${item.hash}`}>
                                {substring(item.hash)}
                            </Button>
                        </td>
                        {
                            props.type !== 'simple' &&
                            <td><Link to={`/blocks/detail/${item.number}`} className="link">{item.number}</Link>
                            </td>
                        }
                        <td>{item.type}</td>
                        <td>
                            <Button
                                color={props.pageName === 'Account' ? 'gray' : 'blue'}
                                size="wide"
                                link={`/account/${item.from}`}
                                disable={props.pageName === 'Account' ? true : false}
                            >
                                {substring(item.from)}
                            </Button>
                        </td>
                        <td><img src={arrow} alt="에서"/></td>
                        <td>
                            <Button color="blue" size="wide" link={`/account/${item.to}`}>
                                {substring(item.to)}
                            </Button>
                        </td>
                        {
                            props.type !== 'simple' && <td>{fromNow(item.time)}</td>
                        }
                        {
                            props.type !== 'simple' && <td>{wei2Daon(item.amount)}</td>
                        }
                        {
                            props.type !== 'simple' && <td>{wei2Daon(item.price)}</td>
                        }
                    </tr>
                ))
            }
            </tbody>
        </table>
    );
};

export default TransactionsComponentTable;