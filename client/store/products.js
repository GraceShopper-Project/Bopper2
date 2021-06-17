
// Action types
export const GET_PRODUCTS = "GET_PRODUCTS";

// Action creators
export const getProductsOnServer = (products) => ({
  type: GET_PRODUCTS,
  products,
})

// Thunk creators
export const getProducts = () => {
  return async (dispatch) => {
    const data = await fetch("/api/products").then(res => res.json());
    dispatch(getProductsOnServer(data));
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
