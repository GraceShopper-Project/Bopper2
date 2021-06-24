import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import { Login, Signup } from './components/AuthForm';
import AllProducts from './components/AllProducts';
import SingleProduct from './components/SingleProduct';
import Home from './components/Home';
import {me} from './store'
import AllUsers from './components/AllUsers';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import OrdersView from './components/OrdersView';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <div>
        {isLoggedIn ? (
          <Switch>
            <Route path="/home" component={Home} />
            <Route exact path="/products" component={AllProducts} />
            <Route exact path="/products/:prodId" component={SingleProduct} />
            <Route exact path="/users" component={AllUsers} />
            <Route exact path="/cart" component={CartView} />
            <Route path="/checkout" component={CheckoutView} />
            <Route exact path="/orders" component={OrdersView} />
            <Route path="/orders/:orderId" component={OrdersView} />
            <Redirect to="/home" />
          </Switch>
        ) : (
          <Switch>
            <Route path='/home' component={ Home } />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route exact path="/products" component={AllProducts} />
            <Route exact path="/products/:prodId" component={SingleProduct} />
            <Route exact path="/cart" component={CartView} />
            <Route path="/checkout" component={CheckoutView} />
          </Switch>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
