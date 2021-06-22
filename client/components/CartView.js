import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addToCart, removeFromCart } from "../store/singleUser";

class CartView extends React.Component {

  render() {
    console.log("User: ", this.props.user);
    const cartProducts = this.props.user.cart || [];
    return (
      <div className="cart-products">
        {cartProducts.map((product, idx) => {
          return (
            <div key={idx}>
              <h1>
                <Link to={`/products/${product.id}`}>{product.name}</Link>
              </h1>
                <h4>
                  <p>{product.description}</p>
                  <p>${(product.price / 100).toFixed(2)}</p>
                  <p>
                    Quantity: {product.quantity}&nbsp;
                    <button onClick={() => this.props.addToCart(product, 1)}>+</button>
                    <button onClick={() => this.props.removeFromCart(product.id)}>-</button>
                  </p>
                  <img src={product.imageUrl} />
                </h4>
            </div>
          );
        })}  
      </div>
    );
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


