import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import auth from './auth'
import productsReducer from './products'
import singleProductReducer from './singleProduct'
import allUsers from './allUsers'
import singleUser from './singleUser'

const reducer = combineReducers({ auth, 
  products: productsReducer, 
  product: singleProductReducer,
  users: allUsers,
  user: singleUser
})


const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './auth'
