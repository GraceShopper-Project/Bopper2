import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store";
import ViewCartButton from './ViewCartButton'

const Navbar = ({ handleClick, isLoggedIn, cartItemCount }) => (
  <div>
    <div>
      <h1>Grace Bopper</h1>
      <ViewCartButton cartItemCount={cartItemCount} />
    </div>
    <nav>
      {isLoggedIn ? (
        <div>
          {/* The navbar will show these links after you log in */}
          <Link to="/home">Home</Link>
          <Link to="/products">Products</Link>
          <a href="#" onClick={handleClick}>
            Logout
          </a>
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/products">Products</Link>
        </div>
      )}
    </nav>
    <hr />
  </div>
);

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
    cartItemCount: state.user.cart.length,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);
