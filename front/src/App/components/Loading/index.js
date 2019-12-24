// base
import React from 'react';
import { ClipLoader } from 'react-spinners';

// assets
import './loading.scss';

class Loading extends React.Component {
  render() {
    return (
      <div className='Loading'>
        <ClipLoader
          sizeUnit={"px"}
          size={100}
          color={'#203CC6'}
        />
      </div>
    )
  }
}

export default Loading;
