import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

const createStoreWithMiddle = applyMiddleware(thunk)(createStore);

export default function configureStore(initialState) {
    return createStoreWithMiddle(reducers, initialState);
}