import axios from "axios";
import initialState from "./index";

// Action types
const GET_PRODUCTS = "GET_PRODUCTS";

// Action creators
export const getProductsOnServer = (products) => ({
  type: GET_PRODUCTS,
  products,
})

// Thunk creators
export const getProducts = () => {
  return async (dispatch) => {
    const { data: products } =  await axios.get("/api/products");
    dispatch(getProducts(products));
  }
}

// Reducer for products
export default function productsReducer(state = initialState.products, action) {
  switch (action.type) {
    case GET_PRODUCTS:
      return action.products;
    default:
      return state;
  }
}
