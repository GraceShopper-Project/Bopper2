import React from "react";
import { connect } from "react-redux";
import { getProducts } from "../store/products";
import { ProductListView } from "./ProductListView";

export class AllProducts extends React.Component {

   componentDidMount() {
      this.props.setProducts();
   }

   render() {
      const products = this.props.products || [];
      return (
         <ProductListView products={products} />
      );
   }
}

const mapState = (state) => {
   return {
   products: state.products,
}};

const mapDispatch = (dispatch) => {
   return {
      setProducts: () => dispatch(getProducts())
   }
};

export default connect(mapState, mapDispatch)(AllProducts);
