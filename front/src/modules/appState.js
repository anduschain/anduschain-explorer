import { handleActions, createAction } from 'redux-actions';
import { getNetWork } from '../helper';
import produce from 'immer';

const MAINNET = 'appstate/MAINNET';
const TESTNET = 'appstate/TESTNET';
const DEVNET = 'appstate/DEVNET';

export const mainnet = createAction(MAINNET);
export const testnet = createAction(TESTNET);
export const devnet = createAction(DEVNET);

const initialState = {
    network:  getNetWork(),
};

export default handleActions({
    [MAINNET]: (state, action) => produce(state, draft => {
        draft.network = 'mainnet'
    }),
    [TESTNET]: (state, action) => produce(state, draft => {
        draft.network = 'testnet'
    }),
    [DEVNET]: (state, action) => produce(state, draft => {
        draft.network = 'devnet'
    }),
}, initialState);
