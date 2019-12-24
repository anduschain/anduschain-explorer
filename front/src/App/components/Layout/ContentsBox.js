// base
import React from 'react';

// assets
import './contentsBox.scss';

const ContentsBox = (props) => {
  return (
    <div className="ContentsBox">
      {
        props.title && (<div className="contentsBox_title">{props.title}</div>)
      }
      {props.children}
    </div>
  )
}

ContentsBox.defaultProps = {
  title : false,
};

export default ContentsBox