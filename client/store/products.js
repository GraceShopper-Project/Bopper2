import axios from "axios";


// Action types
const GET_PRODUCTS = "GET_PRODUCTS";

// Action creators
export const getProductsOnServer = (products) => ({
  type: GET_PRODUCTS,
  products,
})

// Thunk creators
export const getProducts = () => {
  console.log("I'm in the thunk");
  return async (dispatch) => {
    const { data: products } =  await axios.get("/api/products");
    dispatch(getProductsOnServer(products));
  }
}

// Reducer for products
export default function (state = [], action) {
  switch (action.type) {
    case GET_PRODUCTS:
      return action.products;
    default:
      return state;
  }
}
