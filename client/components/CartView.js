import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addToCart, removeFromCart } from "../store/singleUser";
import CartItemCard from "./CartItemCard";

class CartView extends React.Component {
  render() {
    const cartProducts = this.props.user.cart || [];
    return (
      <div className="cart-products">
        {cartProducts.map((product) => <CartItemCard 
          key={product.id}
          product={product}
          clickable={true}
          addOne={this.props.addToCart}
          subtractOne={this.props.removeFromCart}
          setQuantity={false}
          />)}
      </div>)
  }
}

const mapState = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatch = (dispatch) => {
  return {
    addToCart: (product) => dispatch(addToCart(product, 1)),
    removeFromCart: (id) => dispatch(removeFromCart(id))
  };
};

export default connect(mapState, mapDispatch)(CartView);


