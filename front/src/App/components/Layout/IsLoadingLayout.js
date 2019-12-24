// base
import React, {Component} from 'react';

// components
import { Loading } from '..';

class IsLoadingLayout extends Component {
  render() {
    return (
      <div className="IsLoadingLayout">
        {
          this.props.isLoading ? <Loading /> : this.props.children
        }
      </div>
    )
  }
}

IsLoadingLayout.defaultProps = {
  isLoading : false
};

export default IsLoadingLayout;