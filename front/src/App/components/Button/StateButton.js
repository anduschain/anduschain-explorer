// base
import React from 'react';

// assets
import './stateButton.scss';
import icon_success from '../../assets/images/common/success.png';

const StateButton = (props) => {
  return (
    <button className={`StateButton ${props.state}`}>
      <img className="thumb" src={props.state === 'success' ? icon_success : ''} alt="성공"/>
      {props.state}
    </button>
  )
};

StateButton.defaultProps = {
  state : 'success',
};

export default StateButton;