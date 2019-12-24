// base
import React from 'react';
import {Link, NavLink} from 'react-router-dom';

// assets
import './header.scss';
import {header_logo} from '../../assets/images/header';
import Dropdown from '../Dropdown'

const Header = (props) => {
    return (
        <header className={"Header"}>
            <div className="l-wrapper u-clearfix">
                <Link to="/">
                    <img className="logo" src={header_logo} alt="andus logo"/>
                </Link>
                <nav>
                    <NavItem link="/blocks/1" title="Blocks"/>
                    <NavItem link="/transactions/1" title="Transactions"/>
                </nav>
                <div className="network">
                    <Dropdown/>
                    {/*<img src={header_arrow} alt="더 보기"/>*/}
                </div>
            </div>
        </header>
    )
};

const NavItem = props => {
    const style = {
        'display': 'inline-block',
        'marginRight': '50px',
        'padding': '0 30px',
        'height': '40px',
        'lineHeight': '40px',
        'borderRadius': '20px',
        'backgroundColor': 'rgba(0,0,0,0.3)'
    }
    const activeStyle = {
        backgroundColor: '#000',
        color: '#fff'
    }

    return (
        <NavLink to={props.link} activeStyle={activeStyle} style={style}><span>{props.title}</span></NavLink>
    )
}

NavItem.defaultProps = {
    link: '/',
    title: 'navTitle',
};

export default Header