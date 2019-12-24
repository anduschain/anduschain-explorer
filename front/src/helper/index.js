import moment from 'moment';

const fromNow = (now) => {
    return moment.unix(now).fromNow()
};

const timeDiff = (prev, now) => {
    let n = moment.unix(now);
    let p = moment.unix(prev);

    let ms = n.diff(p);
    let d = moment.duration(ms);

    return d.asSeconds()
};

const substring = (str) => {
    if (!str) return;
    if (str === 'contract') return str;

    let f = str.slice(0,6);
    let b = str.slice(str.length-6);

    let rest = f+'...'+b;
    return rest;
};

const timeNow = () =>{
    return moment.utc().format();
};

const isJoinTx = (addr) =>{
    if (addr === "0x5AeaB10a26Ce20fE8f463682FfC3Cf72D2580c3c"){
        return "JoinTx";
    }else if(addr === null || addr === "") {
        return "Contract";
    }else{
        return "Transfer";
    }

};

const pageMove = (cur, total, div, self, callback) => {
    if(div === 'prv'){
        if(cur > 1) {
            self.setState({
                currentPage : cur - 1,
            }, () => {
                callback();
            })
        }
    }else if(div === 'next'){
        if(cur < total) {
            self.setState({
                currentPage: cur + 1,
            }, () => {
                callback();
            })
        }
    }
};

const wei2Daon = (wei) =>{
    let num = wei * 0.000000000000000001;
    return num.toFixed(18).replace(/\.?0+$/, '');
};

/**
 * @return {string}
 */
function getNetWork() {
    let chainID = process.env.REACT_APP_CHAIN_ID;
    if (chainID === '14288641') {
        return 'testnet';
    }else if(chainID === '14288640') {
        return 'mainnet'
    }else{
        return `unknown_${chainID}`
    }
}

export {
    fromNow, timeDiff, substring, timeNow, isJoinTx, pageMove, wei2Daon, getNetWork
}
