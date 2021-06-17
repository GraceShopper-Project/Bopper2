import React from "react";
import { connect } from "react-redux";
import { getProducts } from "../store/products";

export class AllProducts extends React.Component {
   constructor(props) {
      super(props);
   }

   componentDidMount() {
      console.log(this.props)
      this.props.setProducts();
      
   }

   render() {
      console.log("Hi, I'm in the component!")
      const products = this.props.products || [];
      return (
        <div className="products">
            {products.map((product) => {
                return (
                  <div key={product.id}>
                    <h1>{product.name}</h1>
                    <i>
                      <h4>
                        <p>{product.description}</p>
                        <p>{product.price}</p>
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

const mapState = (state) => ({
   products: state.products,
});

const mapDispatch = (dispatch) => {
   return {
      setProducts: () => dispatch(getProducts())
   }
};

export default connect(mapState, mapDispatch)(AllProducts);
