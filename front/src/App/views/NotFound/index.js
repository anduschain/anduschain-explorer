// base
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// components
import { Layout, Search, Button } from '../../components';

// assets
import './notFound.scss';
import arrow_back from '../../assets/images/common/arrow-back.png';

class NotFound extends Component {
  render() {
    return (
      <Layout>
        <main className="NotFound">
          <div className="l-wrapper">
            <div className="page_upper">
              <Search />
            </div>
            <div className="NotFound-contents">
              <h2 className="NotFound-heading">Page not found</h2>
              <p className="NotFound-desc">
                We’re sorry, the page you requested could not be found.<br />
                Please go back to the homepage.
              </p>
              <div className="NotFound-button">
                <Link to="/">
                  <Button color="black" size="big">
                    <img className="NotFound-button-thumb" src={arrow_back} alt="뒤로가기"/>
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    )
  }
}

export default NotFound