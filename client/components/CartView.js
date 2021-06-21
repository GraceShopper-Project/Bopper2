import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addToCart, fetchUser, removeFromCart } from "../store/singleUser";

class CartView extends React.Component {
  constructor(props) {
    super(props);
    this.plusHandler = this.plusHandler.bind(this);
    this.minusHandler = this.minusHandler.bind(this);
  }

  componentDidMount() {
    this.props.fetchUser(this.props.match.params.id);
  }

  plusHandler(product) {
  }

  minusHandler(product) {
  }

  render() {
    console.log("User: ", this.props.user);
    const cartProducts = this.props.user.cart || [];
    return (
      <div className="cart-products">
        {cartProducts.map((product) => {
          return (
            <div key={product.id}>
              <h1>
                <Link to={`/products/${product.id}`}>{product.name}</Link>
              </h1>
              <i>
                <h4>
                  <p>{product.description}</p>
                  <p>${(product.price / 100).toFixed(2)}</p>
                  <p>
                    Quantity: {product.quantity}&nbsp;
                    <button onClick={() => plusHandler(product)}>+</button>
                    <button onClick={() => minusHandler(product)}>-</button>
                  </p>
                  <img src={product.imageUrl} />
                </h4>
              </i>
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
    fetchUser: (userId) => dispatch(fetchUser(userId)),
  };
};

export default connect(mapState, mapDispatch)(CartView);
