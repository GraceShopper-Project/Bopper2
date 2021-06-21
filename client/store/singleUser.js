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
          },
          body: getState().user.cart,
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
        },
        body: getState().user.cart,
      });
    }
  } catch (err) {
    throw err;
  }
}

const initialState = {
  cart: []
}

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_USER:
      return action.user;
    case actionTypes.ADD_TO_CART:
      return {
        ...state,
        cart: [
          ...state.cart,
          {
            productId: action.productId,
            quantity: action.quantity,
          },
        ],
      };
    case actionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((product) => product.id !== action.productId)
      }
    default:
      return state;
  }
}
