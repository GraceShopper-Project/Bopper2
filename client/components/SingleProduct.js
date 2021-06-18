import React from "react";
import { connect } from "react-redux";
import { getSingleProduct } from "../store/singleProduct";

class SingleProduct extends React.Component {
   componentDidMount() {
      this.props.setProduct(this.props.match.params.id);
   }

   render() {
      const product = this.props.product || {};
      return (
         <div className="product">
            <div key={product.id}>
               <h1>{product.name}</h1>
               <i>
                  <h4>
                     <p>{product.description}</p>
                     <p>${(product.price / 100).toFixed(2)}</p>
                     <img src={product.imageUrl} />
                  </h4>
               </i>
            </div>
            );
         </div>
      );
   }
}

const mapState = (state) => {
   return {
   product: state.product,
}};

const mapDispatch = (dispatch) => {
   return {
      setProduct: (prodId) => dispatch(getSingleProduct(prodId))
   }
};

export default connect(mapState, mapDispatch)(SingleProduct);
