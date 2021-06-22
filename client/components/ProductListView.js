import React from "react";
import { Link } from "react-router-dom";

export const ProductListView = (props) =>{
   return(
   <div className="products">
      {props.products.map((product) => {
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
   )
}