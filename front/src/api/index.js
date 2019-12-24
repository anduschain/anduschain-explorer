import cons from '../constants';
import axios from 'axios';

export const recently = (net) => axios.get(cons.API(net).recently);
export const miners = (net) => axios.get(cons.API(net).miners);
export const getLoca = (ip) => axios.get(cons.IP_ADDR(ip));
//parameter 없으면 총 갯수, 숫자 : page 마다 출력되는 정보들
export const blocks = (net, page) =>
    axios.get(
        cons.API(net).blocks+'/'+page
);
export const blockDetail = (net, num) => axios.get(cons.API(net).block+'/' + num);
//export const blockDetailTxList = (net, num, page) => axios.get(cons.API(net).block+'/'+num+'/'+page);
export const blockDetailTxList = (net, num, type, page) => axios.get(cons.API(net).block+'/'+num+'/'+type+'/'+page);
export const recentblocks = (net) => axios.get(cons.API(net).recentblocks);
export const blockpageinfo = (net) => axios.get(cons.API(net).blocks);

export const accountDetail = (net, address) =>
    axios.get(
        cons.API(net).account+'/'+address
    );

export const accountTransactionList = (net, address) =>
    axios.get(
        cons.API(net).accountTransaction+'/'+address
    );

export const accountTransactionDetail = (net, address,page) =>
    axios.get(
        cons.API(net).accountTransaction+'/'+address+'/'+page
    );

export const transactionPageInfo = (net) => axios.get(cons.API(net).transactions);

export const transactions = (net, page) =>
    axios.get(
        cons.API(net).transactions+'/'+page
);
export const transactionDetail = (net, hash) => axios.get(cons.API(net).transaction+'/'+hash);
