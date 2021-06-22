import React from "react";
import { Link } from "react-router-dom";

export default function ViewCartButton(props) {
  const {
    cartItemCount
  } = props

  return (
    <Link to='/cart'>
      <i className="fas fa-shopping-cart"></i>
    </Link>
  )
}