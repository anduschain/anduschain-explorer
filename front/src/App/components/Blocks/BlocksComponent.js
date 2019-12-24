// base
import React from 'react';
import { Link } from 'react-router-dom';
import { fromNow, substring } from '../../../helper';

// assets
import './blocksComponent.scss';

// components
import { Button } from '..';

const BlocksComponent = (props) => {
    return (
      <table className={`table_type01 BlocksComponent ${props.type === 'simple' && 'simple'}`}>
        <thead>
          <tr>
            <th>BLOCK #</th>
            <th>TIME</th>
            <th>TOTAL TXS</th>
            <th>MINOR</th>
            {/*<th>REWARD (TEST_DAON)</th>*/}
          </tr>
        </thead>
        <tbody>
        {
            props.blocks.length > 0 &&
                props.blocks.map((item,i)=> (
                <tr key={i}>
                  <td><Link to = {`/blocks/detail/${item.number}`} className="link">{item.number}</Link></td>
                  <td>{fromNow(item.time)}</td>
                  <td>{item.totalTx}</td>
                  <td>
                      {/*// uri에 address 넘겨줘서 account 페이지 로딩될때 api 호출*/}
                    <Button color="blue" size="wide" link={`/account/${item.miner}`}>
                      {substring(item.miner)}
                    </Button>
                  </td>
                  {/*<td>3.265905</td>*/}
                </tr>
            ))
        }
          </tbody>
      </table>
    )
}

BlocksComponent.defaultProps = {
  type : 'full',
  blocks : [],
};

export default BlocksComponent
