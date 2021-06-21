import React from "react";
import { Redirect } from "react-router-dom";

export default function(props) {
  const {
    cartItemCount
  } = props

  return (
    <div onClick={() => <Redirect to='/cart' />}>
      <i className="fas fa-shopping-cart"></i>
    </div>
  )
}