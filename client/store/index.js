import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import user from './user';
import templates from './templates';
import toast from './toast';

const reducer = combineReducers({user, templates, toast});
const middleware = applyMiddleware(thunkMiddleware);

const store = createStore(reducer, middleware);

export default store;

export * from './user';
export * from './templates';
export * from './toast';
