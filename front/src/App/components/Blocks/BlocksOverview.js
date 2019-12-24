// base
import React from 'react';
import {fromNow, timeNow} from '../../../helper'

// components
import { CopyButton } from '../../components';

// assets
import './blocksOverview.scss';
const copy = require('copy-text-to-clipboard');

const BlocksOverview = (props) => {
    const {hash, header, txCnt, eachTxCnt} = props.block;
    if (hash === "") return null;
    return (
      <table className="table_type02 BlocksOverview_table">
        <tbody>
          <tr>
            <th>Time</th>
            <td>{fromNow(header.timestamp)}
              <time className="u-gray"> {timeNow()}</time>
            </td>
          </tr>
          <tr>
            <th>Hash</th>
            <td>
              {hash}
              <span onClick={() =>  copy(hash)}>{<CopyButton />}</span>
            </td>
          </tr>
          <tr>
            <th>Parent Hash</th>
            <td>
                {header.parentHash}
                <span onClick={() => copy(header.parentHash)}>{<CopyButton />}</span>
            </td>
          </tr>
          <tr>
            <th>Total TXs</th>
            <td>{txCnt} TX  (General Transactions : {eachTxCnt[0]}, Join Transactions : {eachTxCnt[1]}, Contract : {eachTxCnt[2]})</td>
          </tr>
          {/*<tr>*/}
          {/*  <th>Difficulty</th>*/}
          {/*  <td>3.2649525*/}
          {/*   */}
          {/*  </td>*/}
          {/*</tr>*/}
          {/*<tr>*/}
          {/*  <th>Block Size</th>*/}
          {/*  <td>1,460 bytes</td>*/}
          {/*</tr>*/}
        </tbody>
      </table>
    )
}

export default BlocksOverview
