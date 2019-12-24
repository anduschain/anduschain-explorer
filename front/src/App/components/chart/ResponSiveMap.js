import React, {Component} from 'react';
import DataMap from './datamap';

const radius = 6;
const bubleFill1 = '#0492fe';
// const bubleFill2 = '#fc8d59';
export default class Responsive extends Component {
    state = {
        on : true,
        bubleFill : "bubbleFill1",
        location : [],
        buf : [],
    };

    setCount = () => {
        if (this.state.on) {
            this.setState({on: false, location : []})
        } else {
            this.setState({on: true, location: this.state.buf})
        }
    };

    componentDidMount() {
        this.interval = setInterval(this.setCount , 1000)
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data !== this.state.location){
            this.setState({location : nextProps.data, buf : nextProps.data})
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        return (
            <DataMap
                responsive
                geographyConfig={{
                    popupOnHover: false,
                    highlightOnHover: false
                }}
                fills={{
                    defaultFill: '#cccccc',
                    bubbleFill1: bubleFill1,
                }}
                bubbles={
                    this.state.location.map((locat, i) => ({
                        name : locat.city,
                        radius,
                        latitude : locat.latitude,
                        longitude : locat.longitude,
                        fillKey : this.state.bubleFill,
                    }))
                }
                bubbleOptions={{
                    borderWidth: 1,
                    borderColor: '#36a0f1'
                }}
            />
        );
    }
}

