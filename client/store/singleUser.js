/**
 * Action Types
 */
export const actionTypes = {
  SET_USER: "SU_SETUSER",
  ADD_TO_CART: "SU_ADD_TO_CART",
};

/**
 * Action Creators
 */
export const setUser = (user) => {
  return {
    type: actionTypes.SET_USER,
    user,
  };
};

const _addToCart = (productId, quantity) => {
  return {
    type: actionTypes.SU_ADD_TO_CART,
    productId,
    quantity,
  };
};

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
    try {
      const token = window.localStorage.getItem("token");
      if (token) {
        fetch(`/api/users/${userId}/cart`, {
          method: "PUT",
          headers: {
            authorization: token,
          },
          body: getState().user.cart,
        });
      }
      dispatch(_addToCart(productId, quantity));
    } catch (err) {
      throw err;
    }
  };

/**
 * REDUCER
 */
export default function (state = {}, action) {
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
    default:
      return state;
  }
}
