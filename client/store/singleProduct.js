

// Action types
export const GET_SINGLE_PRODUCT = "GET_SINGLE_PRODUCT";

// Action creators
export const getSingleProductOnServer = (product) => ({
  type: GET_SINGLE_PRODUCT,
  product,
})

// Thunk creators
export const getSingleProduct = (prodId) => {
  return async (dispatch) => {
    const data = await fetch(`/api/products/${prodId}`)
      .then(res => res.json());
    dispatch(getSingleProductOnServer(data));
  }
}

// Reducer for products
export default function (state = {}, action) {
  switch (action.type) {
    case GET_SINGLE_PRODUCT:
      return action.product;
    default:
      return state;
  }
}