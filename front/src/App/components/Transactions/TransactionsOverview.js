// base
import React from 'react';
import { Link } from 'react-router-dom';

// components
import { StateButton, Button } from '../../components';

import {fromNow, wei2Daon} from '../../../helper';

// assets
import arrow from '../../assets/images/transactions/arrow.png';
import './transactionsOverview.scss';
import { substring } from '../../../helper';

/*
*  "RT": {
            "hash": "0x0007fb8eac74ae53b140752a76ba0bf8634dbc13c63451ba3db5b49e6c8f5525",
            "number": 49590,
            "time": "1567573674",
            "from": "0xA315685Ea882AE28BD59753D9EF125a9730EE919",
            "to": "0x000000000000000000000000000000000000dA07",
            "type": "JoinTx",
            "amount": "0",
            "price": "0"
        },
        "Tx": {
            "txHash": "0x0007fb8eac74ae53b140752a76ba0bf8634dbc13c63451ba3db5b49e6c8f5525",
            "blockHash": "0x43dc4afbc526af3c755d0bb3126b55d90122dd43dcf3216c7c8d8e40711b8ed8",
            "From": "0xA315685Ea882AE28BD59753D9EF125a9730EE919",
            "Data": {
                "type": 1,
                "nonce": 17197,
                "gasPrice": "0",
                "gas": 0,
                "to": "0x000000000000000000000000000000000000dA07",
                "value": "0",
                "input": "+MKUWjHwUkUpwGk2aldneUK/3nc/mVmUEMpLhP75/OiRDLWKz3clWhqLYf0K+FIBMYMwLjFkCoYwLjYuMTK4QRm5WmmKcTkoDCuwQOMRxCQvbDlr3w3gtnxrUwaStkCIco9lMxlLbOA6TsDWimlvTZoUg3LAW9ic+7FwkIUdaD8AuEFntEiEyI+7DnA7xxgNvAOLV/v9tBtu5PjpAw5D0k/B7AgFzxUqzn3AxJdwm92DkpsPXWyg9fXE9xDAs5yTLphJAAsAAAAAAAAAYccyYP8XvrJSWMO1ChfDs30pOj0DoJbIWRVYv4+GF0A="
            }
        }
* */

const TransactionsOverview = (props) => {
  const { RT, Tx } = props.txData;
  if (!RT || !Tx) return null;
  const { number, type, amount, from, to, time, price} = RT;
  const { Data } = Tx;

  return (
    <div className="TransactionsOverview">
      <table className="table_type02">
        <tbody>
          <tr>
            <th>TX Type</th>
            <td>{type}</td>
            <th>Amount</th>
            <td>{wei2Daon(amount)}<small className="u-gray"> Daon</small></td>
          </tr>
          <tr>
            <th>Block #</th>
            <td>
              <Link to ={`/blocks/detail/${number}`} className="link">
                {number}
              </Link>
            </td>
            <th>Gas Price</th>
            <td>{wei2Daon(Data ? Data.gasPrice : 0)} <small className="u-gray"> Daon</small></td>
          </tr>
          <tr>
            <th>
              From
              <img className="transaction_arrow" src={arrow} alt="부터"/>
              To
            </th>
            <td>
              <Button color="blue" link={`/account/${from}`}>
                {substring(from)}
              </Button>
              <img className="transaction_arrow" src={arrow} alt="부터"/>
              <Button color="blue" link={`/account/${to}`}>
                {substring(to)}
              </Button>
            </td>
            <th>Gas Used</th>
            <td>{wei2Daon(Data ? Data.gasPrice : 0)}</td>
          </tr>
          <tr>
            <th>Time</th>
            <td>{fromNow(time)}</td>
            <th>Gas Limit</th>
            <td>{wei2Daon(Data ? Data.gas : 0)}</td>
          </tr>
          <tr>
            <th>Nonce</th>
            <td>{parseInt(Data ? Data.nonce : 0)}</td>
            <th>TX Fee</th>
            <td>{wei2Daon(price)} <small className="u-gray"> Daon</small></td>
          </tr>
        </tbody>
      </table>
      <div className="transaction_state">
        <StateButton state="success" />
      </div>
    </div>
  )
};

TransactionsOverview.defaultProps = {
  txData : {
    RT : {},
    Tx : {},
  },
};

export default TransactionsOverview
