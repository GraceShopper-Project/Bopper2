import React, { useEffect, useState } from 'react'
import {connect} from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchUser } from '../store/singleUser'
import CartItemCard from './CartItemCard'

const formatOrderDate = (isoString) => {
    const date = new Date(isoString)
    return <time className="order-date" dateTime={isoString}>{date.toTimeString()}</time>
}

const OrderListLine = ({order}) => (
    <div className="d-flex justify-content-between align-items-center">
        <span className="order-id">{order.id}</span>&nbsp;
        {formatOrderDate(order.updatedAt)}
        <span className="badge badge-info badge-pill">{order.products.length}</span>
    </div>
)

/**
 * Renders info pane for chosen order
 */
const OrderDetails = ({order}) => (
    <div className="card col">
        <div className="card-header">
            Order Details (id #{order.id})
        </div>
        <div className="card-body">
            <h5 className="card-title">{formatOrderDate(order.updatedAt)}</h5>
            <p className="card-text">...order details go here...</p>
        </div>
        <hr className="my-4" />
        <div className="card-body">
            <h6 className="card-title">Products</h6>
            {order.products.map(p => <CartItemCard key={p.id} product={p} clickable={false} />)}
        </div>
    </div>
)

/**
 * Produces the initial active item for the order selector
 */
const ActiveListItem = ({order}) => (
    <a href="#" className="list-group-item list-group-item-action active" aria-current="true">
        <OrderListLine order={order} />
    </a>
)

/**
 * Produces a disabled item for the order selector
 */
const DisabledListItem = ({order}) => (
    <a href="#" className="list-group-item list-group-item-action disabled" tabindex="-1" aria-disabled="true">
        <OrderListLine order={order} />
    </a>
)

/**
 * produces a regular order selector item
 */
const RegularListItem = ({order, onClick}) => (
    <a href="#" className="list-group-item list-group-item-action" onClick={() => onClick(order.id)}>
        <OrderListLine order={order} />
    </a>
)

const OrderSelector = ({orders, onClick, activeOrderId }) => (
    <div className="list-group col-md-5">
        {orders.map(o => {
            if (o.id === activeOrderId) {
                return <ActiveListItem key={o.id} order={o}/>
            } else if (o.status === 'cancelled') {
                return <DisabledListItem key={o.id} order={o}/>
            } else {
                return <RegularListItem key={o.id} order={o} onClick={() => onClick(o.id)} />
            }
        })}            
    </div>
)

export const OrdersView = ({
    orders,
    loadUser,
}) => {
    // run loadOrders only once
    useEffect(() => { loadUser() }, [])

    const routeParams = useParams()
    let initiallySelectedOrderId
    
    // if given an orderId in the route, use that for the initially selected order
    if (routeParams.orderId) {
        initiallySelectedOrderId = routeParams.orderId
    } else {
        initiallySelectedOrderId = orders.length ? orders[0].id : null
    }

    let [currentOrderId, setCurrentOrderId] = useState(initiallySelectedOrderId)

    const [ selectedOrder ] = orders.filter(o => o.id === currentOrderId)

    if (!(orders && orders.length)) return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )

    return (
        <div id="orders">
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h1 className="display-4 text-center">Your Orders</h1>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <OrderSelector orders={orders} onClick={setCurrentOrderId} activeOrderId={currentOrderId} className="col-md-5"/>
                    {currentOrderId ? 
                        <OrderDetails order={selectedOrder}/> : 
                        <div className="jumbotron col d-flex flex-column justify-content-center align-items-center">
                            <h1 className="display-5">No order selected</h1>
                            <p className="lead">Please select an order from the list at left</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

const mapState = (state) => ({
    orders: state.user.orders,
})

const mapDispatch = (dispatch) => ({
    loadUser: () => dispatch(fetchUser()),
})

export default connect(mapState, mapDispatch)(OrdersView)