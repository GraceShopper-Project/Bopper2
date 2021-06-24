import React from "react";
import { connect } from "react-redux";
import { checkout, fetchOrders } from '../store/singleUser'
import CartItemCard from "./CartItemCard";

export class CheckoutView extends React.Component {
    componentDidMount() {
        // call checkout route to finalize order and fetch updated orders
        this.props.checkout()
    }

    render() {
        // latestOrderId is set by the checkout reducer
        let guestCart;
        const latestOrder = this.props.orders ? this.props.orders.filter(o => o.id === this.props.latestOrderId)[0] : null
      

        if (!latestOrder) {
            guestCart = this.props.user.cart || [];
        }


        const orderItems = (latestOrder) ? latestOrder.products : guestCart;
        const subtotal = orderItems.reduce((total, item) => total + (item.price*item.quantity), 0) / 100
        const taxRate = 0.07
        const taxAmt = (subtotal * taxRate)
        const total = subtotal + taxAmt

        return (
            <div id="cart" className="container">
                <div className="row text-center my-3">
                    {this.props.user.name ?
                    <h1>Congratulations, {this.props.user.name}! You've checked out!</h1> :
                    <h1>Congratulations! You've checked out!</h1>}
                    <small className="text-muted">Enjoy!</small>
                </div>
                <div className="row">
                    <div className="col-8 items">
                        {orderItems.map((product) => <CartItemCard 
                            key={product.id}
                            product={product}
                            clickable={false}
                            setQuantity={false}
                        />)}
                </div>
                <div className="col summary">
                    <div>
                        <div>Item Subtotal:</div><div id="itemSubtotal">${subtotal.toFixed(2)}</div>
                    </div>
                    <div>
                        <div>Tax ({(taxRate * 100).toFixed(2)}%):</div><div id="tax">${taxAmt.toFixed(2)}</div>
                    </div>
                    <div>
                        <div>Shipping:</div><div>Free</div>
                    </div>
                    <div>
                        <div>Total:</div><div>${total.toFixed(2)}</div>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

const mapState = (state) => ({
    latestOrderId: state.user.latestOrderId,
    orders: state.user.orders,
    user: state.user,
})
  
const mapDispatch = (dispatch) => ({
    checkout: () => dispatch(checkout()),
    fetchOrders: () => dispatch(fetchOrders())
})
  
export default connect(mapState, mapDispatch)(CheckoutView);