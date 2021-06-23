import React from "react";
import { connect } from "react-redux";
import { getSingleProduct } from "../store/singleProduct";
import {addToCart} from '../store/singleUser'
import ProductCard from "./ProductCard"

class SingleProduct extends React.Component {

   componentDidMount() {
      const singleProduct = this.props.match.params.prodId
      this.props.setProduct(singleProduct);
   }

  render() {
    const product = this.props.product || [];
    return (
      <div id="single-product">
        <ProductCard 
          {...this.props}
          key={product.id}
          product={product} 
          addToCart={this.props.addToCart}
        />
      </div>
    )
  }
}

const mapState = (state) => {
   return {
      product: state.product,
}};

const mapDispatch = (dispatch) => {
   return {
      setProduct: (singleProduct) => dispatch(getSingleProduct(singleProduct)),
      addToCart: (product) => dispatch(addToCart(product, 1))
   }
};

export default connect(mapState, mapDispatch)(SingleProduct);
