import React from "react";
import { connect } from "react-redux";
import { addToCart, decrementQuantity } from "../store/singleUser";
import CartItemCard from "./CartItemCard";

class CartView extends React.Component {
  render() {
    const cartProducts = this.props.cart || [];
    const subtotal = this.props.cart.reduce((total, item) => total + (item.price * item.quantity), 0) / 100
    const taxRate = 0.07
    const taxAmt = (subtotal * taxRate)
    const total = subtotal + taxAmt

    return (
      <div id="cart" className="container">
        <div className="row">
          <div className="col-8 items">
            {cartProducts.map((product) => <CartItemCard 
            key={product.id}
            product={product}
            clickable={true}
            addOne={this.props.addToCart}
            subtractOne={this.props.decrement}
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
            <button
              id="checkout" 
              name="checkout" 
              className="btn btn-success"
              onClick={() => console.warn('checkout button not connected')}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    cart: state.user.cart,
  };
};

const mapDispatch = (dispatch) => {
  return {
    addToCart: (product) => dispatch(addToCart(product, 1)),
    decrement: (product) => dispatch(decrementQuantity(product))
  };
};

export default connect(mapState, mapDispatch)(CartView);


