const cartStorageKey = "CART"
/**
 * Action Types
 */
export const actionTypes = {
  SET_USER: "SU_SETUSER",
  ADD_TO_CART: "SU_ADD_TO_CART",
  REMOVE_FROM_CART: "SU_REMOVE_FROM_CART",
};

/**
 * Action Creators
 */
export const setUser = (user) => ({
    type: actionTypes.SET_USER,
    user,
});

const _addToCart = (productId, quantity) => ({
    type: actionTypes.ADD_TO_CART,
    productId,
    quantity,
})

const _removeFromCart = (productId) => ({
  type: actionTypes.REMOVE_FROM_CART,
  productId,
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
  (productId, quantity) => async (dispatch, getState) => {
    dispatch(_addToCart(productId, quantity));
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

const getLocalCart = () => {
  if (typeof window !== 'undefined') {
    const cart = window.localStorage.getItem(cartStorageKey)
    if (cart) return JSON.parse(cart);
  }
  return [];
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
            productId: action.productId,
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
    default:
      return state;
  }
}