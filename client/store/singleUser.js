const cartStorageKey = "CART"

const getLocalCart = () => {
  if (typeof window !== 'undefined') {
    const cart = window.localStorage.getItem(cartStorageKey)
    if (cart) return JSON.parse(cart);
  }
  return [];
}
/**
 * Action Types
 */
export const actionTypes = {
  SET_USER: "SU_SETUSER",
  ADD_TO_CART: "SU_ADD_TO_CART",
  REMOVE_FROM_CART: "SU_REMOVE_FROM_CART",
  RESET: "SU_RESET"
};

/**
 * Action Creators
 */
export const setUser = (user) => ({
    type: actionTypes.SET_USER,
    user,
});

const _addToCart = (product, quantity) => ({
    type: actionTypes.ADD_TO_CART,
    product,
    quantity,
})

const _removeFromCart = (productId) => ({
  type: actionTypes.REMOVE_FROM_CART,
  productId,
})

export const reset = () =>({
  type: actionTypes.RESET,
  user: {cart: getLocalCart()}
})

/**
 * Thunks
 */
export const fetchUser = (userId) => async (dispatch) => {
  try {
    const token = window.localStorage.getItem("token");
    if (!token) throw new Error("No Token Found");
    const user = await fetch(`/api/users/${userId}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(setUser(await user.json()));
  } catch (err) {
    throw err;
  }
};

export const addToCart =
  (product, quantity = 1) => async (dispatch, getState) => {
    dispatch(_addToCart(product, quantity));
    try {
      const token = window.localStorage.getItem("token");
      const userId = getState().user.id;
      if (token) {
        fetch(`/api/users/${userId}/cart`, {
          method: "PUT",
          headers: {
            authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(getState().user.cart),
        });
      }
    } catch (err) {
      throw err;
    }
  };

export const removeFromCart = (productId) => async (dispatch, getState) => {
  dispatch(_removeFromCart(productId))
  try {
    const token = window.localStorage.getItem("token");
    const userId = getState().user.id;
    if (token) {
      fetch(`/api/users/${userId}/cart`, {
        method: "PUT",
        headers: {
          authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(getState().user.cart),
      });
    }
  } catch (err) {
    throw err;
  }
}

const initialState = {
  cart: getLocalCart()
}

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  let newState
  switch (action.type) {
    case actionTypes.SET_USER:
      return action.user;
    case actionTypes.ADD_TO_CART:
      newState = {
        ...state,
        cart: [
          ...state.cart,
          {
            ...action.product,
            quantity: action.quantity,
          },
        ],
      };
      if (window) window.localStorage.setItem(cartStorageKey, JSON.stringify(newState.cart))
      return newState;
    case actionTypes.REMOVE_FROM_CART:
      newState = {
        ...state,
        cart: state.cart.filter((product) => product.id !== action.productId)
      }
      if (window) window.localStorage.setItem(cartStorageKey, JSON.stringify(newState.cart))
      return newState
    case actionTypes.RESET:
      return action.user;
    default:
      return state;
  }
}
