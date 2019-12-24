// base
import React from 'react';
import { Link } from 'react-router-dom';

// assets
import './button.scss';

const Button = (props) => {
    const Btn = () => (
        <button
            className={`Button ${props.color} ${props.size}`}
            style={props.disable? {cursor : "default"} : {}}
        >
            {props.children}
        </button>
    );

    return props.disable ?
    (<Btn />) :
    (
        <Link to={props.link}>
             <Btn />
        </Link>
    )
};

Button.defaultProps = {
    color: 'black',
    size : '',
    link : '/',
    disable : false,
};

export default Button;
