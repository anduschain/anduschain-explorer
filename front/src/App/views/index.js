// base
import Main from './Main';
import Blocks from './Blocks';
import BlocksDetail from './Blocks/BlocksDetail';
import Transactions from './Transactions';
import TransactionsDetail from './Transactions/TransactionsDetail';
import Account from './Account';

const routes = [
    {
        path : '/',
        component: Main
    },
    {
        path : '/blocks/:number',
        component: Blocks
    },
    {
        path : '/blocks/detail/:number',
        component: BlocksDetail
    },
    {
        path : '/transactions/:page',
        component: Transactions
    },
    {
        path : '/transactions/detail',
        component: TransactionsDetail
    },
    {
        path : '/transactions/detail/:hash',
        component: TransactionsDetail
    },
    {
        path : '/transaction/:hash',
        component: TransactionsDetail
    },
    {
        path : '/account/:address',
        component: Account
    },
    {
        path : '/transactions/account/:address',
        component: Account
    },
    {
        path : '/transactions/account/:address/:pagenum',
        component: Account
    }
];

export default routes;
