// base
import React from 'react';

// assets
import './pageState.scss';

// components
import { CopyButton } from '../';
const copy = require('copy-text-to-clipboard');

const PageState = (props) => {
  var copyHash = () => {
      copy(props.hash);
  };

  return (
    <div className="pageState">
      <h2 className="pageState_name">
        {props.pageName}
        <span className="pageState_block">{props.block}</span>
      </h2>
      {
        props.pageNetwork && <p className="pageState_network">{props.pageNetwork !== 'testnet' ? "Main Network" : "Test Network"}</p>
      }
      {props.hash && (
        <div className="pageState_hash">
          <span>{props.hash}</span>
          <span onClick={copyHash }><CopyButton /></span>
        </div>
      )}
    </div>
  )
};

PageState.defaultProps = {
  pageName : 'Not Found',
  pageNetwork : false,
  block : '',
  hash : false,
};

export default PageState;