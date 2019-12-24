// base
import React from 'react';
import './Layout.scss';

import { Header, Footer } from '../index.js';

const Layout = (props) => {
    return (
        <div className={"Layout"}>
            <Header />
            {props.children}
            <Footer />
        </div>
    )
}

export default Layout