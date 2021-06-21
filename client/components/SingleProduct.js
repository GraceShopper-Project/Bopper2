import React from "react";
import { connect } from "react-redux";
import { getSingleProduct } from "../store/singleProduct";
import AddToCartButton from './AddToCartButton'
import {addToCart} from '../store/singleUser'

class SingleProduct extends React.Component {
   constructor(props){
      super(props)
   }

   componentDidMount() {
      const singleProduct = this.props.match.params.prodId
      this.props.setProduct(singleProduct);
   }

   render() {
      const product = this.props.product || {};
      return (
         <div className="product">
            <div key={product.id}>
               <h1>{product.name}</h1>
                  <h4>
                     <p>{product.description}</p>
                     <p>${(product.price / 100).toFixed(2)}</p>
                     <img src={product.imageUrl} />
                  </h4>
            </div>
            <AddToCartButton onClick={() => this.props.addToCart(product.id)}/>
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
      setProduct: (singleProduct) => dispatch(getSingleProduct(singleProduct)),
      addToCart: (id) => dispatch(addToCart(id, 1))
   }
};

export default connect(mapState, mapDispatch)(SingleProduct);
