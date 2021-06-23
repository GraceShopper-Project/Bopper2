import React from "react";
import { connect } from "react-redux";
import { getProducts } from "../store/products";
import { addToCart } from "../store/singleUser";
import ProductCard from "./ProductCard";

export class AllProducts extends React.Component {

  componentDidMount() {
      this.props.setProducts();
  }

  render() {
    const products = this.props.products || [];
    return (
      <div id="products">
        {this.props.products.map((product) => (
          <ProductCard 
            {...this.props}
            key={product.id}
            product={product} 
            addToCart={this.props.addToCart}
            />
        ))}
      </div>
    )
  }
}

const mapState = (state) => {
   return {
   products: state.products,
}};

const mapDispatch = (dispatch) => {
   return {
      setProducts: () => dispatch(getProducts()),
      addToCart: (product) => dispatch(addToCart(product))
   }
};

export default connect(mapState, mapDispatch)(AllProducts);
