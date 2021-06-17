import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import auth from './auth'
import productsReducer from './products'
import allUsers from './allUsers'

const reducer = combineReducers({ auth, productsReducer, allUsers })


const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

// export const initialState = {
//   orders: [],
//   orderitems: [],
//   products: [],
//   users: [],
// }

export default store
export * from './auth'
