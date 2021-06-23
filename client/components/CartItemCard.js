import React from "react";
import { Link } from "react-router-dom";

export default function CartItem({ 
  product, 
  clickable, 
  addOne, 
  subtractOne, 
  setQuantity 
}) {
  
  const plusButton = (
    <button onClick={() => addOne(product, 1)}>
      <i className="fas fa-plus-square"></i>
    </button>)

  const minusButton = (
    <button onClick={() => subtractOne(product.id)}>
      <i className="fas fa-minus-square"></i>
    </button>)

  function productLink() {
    if (clickable) {
      return (
        <Link to={`/products/${product.id}`}>
          {product.name}
        </Link>)
    } else {
      return product.name
    }
  }

  function onSetQuantity(evt) {
    const quant = evt.target.value
    setQuantity(quant)
  }

  function quantity() {
    if (setQuantity) {
      return (
        <input 
          type="number" 
          min="0" 
          name="quantity" 
          value={product.quantity}
          onChange={onSetQuantity}>
        </input>)
    } else return product.quantity
  }

  return (
    <div className="card mb-3 cart-item">
      <div className="row g-0">
        <div className="col content">
          <img src={product.imageUrl} 
            className="img-fluid rounded-start"
            alt={product.name} />
          <h5>
            {productLink()}
          </h5>
          <div className="card-text">
            <span className="price">
              ${(product.price / 100).toFixed(2)}
            </span>
            &nbsp;
            <span className="quantity">
              Quantity: {quantity()}
            </span>
            &nbsp;
            {(addOne) ? plusButton : null}
            {(subtractOne) ? minusButton : null}
          </div>
        </div>
      </div>
    </div>  
  )
}
