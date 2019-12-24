// base
import React from 'react';

// assets
import './copyButton.scss';
import icon_copy from '../../assets/images/common/icon-copy.png';

const CopyButton = (props) => {
  return (
    <button className="CopyButton">
      <img className="thumb" src={icon_copy} alt="복사하기" id='CopyButton' />
        COPY
    </button>
  )
};

export default CopyButton;