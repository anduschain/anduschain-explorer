// base
import React from 'react';
// assets
import './pager.scss';
import prev from '../../assets/images/common/page-prev.png';
import next from '../../assets/images/common/page-next.png';

const Pager = (props) => {
    return (
      <div className="Pager">
        <div className="Pager_arrow" onClick={() => props.movepage('prv')}>
          <img src={prev} alt="1개 이전으로 가기"/>
        </div>
        
        <div className="pager_items">
          <span className="pager_current">{props.currentPage}</span>
          <span className="divideLine">/</span>
          <span className="pager_total">{props.totalnum}</span>
        </div>
  
        <div className="Pager_arrow" onClick={() => props.movepage('next')}>
          <img src={next} alt="1개 다음으로 가기"/>
        </div>
      </div>
    )
};

Pager.defaultProps = {
    data : [1,2,3,4,5,6,7,8,9,10],
    currentPage : 1,
    movepage : () => console.log("page button is pressed")
};

export default Pager;