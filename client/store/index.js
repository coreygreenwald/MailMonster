import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'

import user from './user'
import templates from './templates'

const reducer = combineReducers({user, templates})
const middleware = applyMiddleware(thunkMiddleware);

const store = createStore(reducer, middleware)

export default store

export * from './user'
export * from './templates'