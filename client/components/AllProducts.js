import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getProducts } from "../store/products";

class AllProducts extends React.Component {

   componentDidMount() {
      this.props.setProducts();
   }

   render() {
      const products = this.props.products || [];
      return (
         <div className="products">
            {products.map((product) => {
               return (
                  <div key={product.id}>
                     <h1>
                     <Link to={`/products/${product.id}`}>
                        {product.name}
                     </Link>
                     </h1>
                     <i>
                        <h4>
                           <p>{product.description}</p>
                           <p>${(product.price / 100).toFixed(2)}</p>
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
   products: state.products,
}};

const mapDispatch = (dispatch) => {
   return {
      setProducts: () => dispatch(getProducts())
   }
};

export default connect(mapState, mapDispatch)(AllProducts);
