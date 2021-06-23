import React from "react";
import { Link } from "react-router-dom";

export default function CartItem({ 
  product, 
  addToCart,
}) {
  
  return (
    <div className="card">
      <Link to={`/products/${product.id}`}>
        <img src={product.imageUrl} 
          className="img-fluid rounded-start"
          alt={product.name} />
      </Link>
      <div className="card-body">
        <Link to={`/products/${product.id}`}>
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <p className="price">${(product.price / 100).toFixed(2)}</p>
        </Link>
        <button className="btn btn-success" 
          onClick={() => {addToCart(product)}}>Add to Cart</button>
      </div>
    </div>
  )
}
