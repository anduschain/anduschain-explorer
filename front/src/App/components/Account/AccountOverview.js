// base
import React, { Component } from 'react';


// assets
import './AccountOverview.scss';
import {wei2Daon} from "../../../helper";

class AccountOverview extends Component {
  render() {
    const { address, balance, totalTx } = this.props;
    return (
      <table className="table_type02 AccountOverview_table">
        <tbody>
          <tr>
            <th>Account Name</th>
            <td>{address}</td>
          </tr>
          <tr>
            <th>Balance</th>
            <td>{wei2Daon(balance)}<small className="u-gray"> Daon</small></td>
          </tr>
          <tr>
            <th>Total TXs</th>
            <td>{totalTx} TXs</td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default AccountOverview
