import React from "react";
import { connect } from "react-redux";
import { checkout } from '../store/singleUser'
import CartItemCard from "./CartItemCard";

export class CheckoutView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            order: {},
        }
    }

    async componentDidMount() {
        // call /checkout route & get final cart state
        const finalizedOrder = await checkout()

        if (finalizedOrder) {
            this.setState({ 
                loading: false,
                order: finalizedOrder 
            })
        }
    }

    render() {
        const orderItems = this.props.order || [];
        const subtotal = orderItems.reduce((total, item) => total + item.price, 0) / 100
        const taxRate = 0.07
        const taxAmt = (subtotal * taxRate)
        const total = subtotal + taxAmt

        return (
            <div id="cart" className="container">
                <div className="row">
                    <h2>Congratulations, Consumer! You've checked out!</h2>
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

const mapState = (state) => {
    return {
      order: state.user.cart,
    };
  };
  
const mapDispatch = (dispatch) => {
    return {
        checkout: () => dispatch(checkout())
    };
};
  
export default connect(mapState, mapDispatch)(CheckoutView);
  