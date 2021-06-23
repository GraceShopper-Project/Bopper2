  import React from "react";
  import { connect } from "react-redux";
  import { Link } from "react-router-dom";
  import { logout } from "../store";
  import ViewCartButton from './ViewCartButton'

  const Navbar = ({ handleClick, isLoggedIn, cartItemCount }) => (
    <nav className="navbar navbar-expand-lg navbar-default bg-default">
      <div className="container-fluid">
        <span className="navbar-brand">
          <i className="fas fa-headphones fa-xs"></i>&nbsp;
          Grace Bopper &nbsp;
          <i className="fas fa-play fa-xs"></i>
        </span>
          <ul className="navbar-nav">
            {isLoggedIn ? (
            <div>
              {/* The navbar will show these links after you log in */}
              <li className="nav-item">
                <Link to="/home">Home</Link>
                <Link to="/products">Products</Link>
                <a href="#" onClick={handleClick}>
                  Logout
                </a>
                <ViewCartButton cartItemCount={cartItemCount} />
              </li>
            </div>
            ) : (
            <div>
              {/* The navbar will show these links before you log in */}
              <li className="nav-item">
                <Link to="/home">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
                <Link to="/products">Products</Link>
                <ViewCartButton cartItemCount={cartItemCount} />
              </li>
            </div>
            )}
          </ul>
        {/* </div> */}
      </div>
    </nav>
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
