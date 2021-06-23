const cartStorageKey = "CART"

const getLocalCart = () => {
  if (typeof window !== 'undefined') {
    try {
      const cart = window.localStorage.getItem(cartStorageKey)
      if (cart) {
        const parsedArr = JSON.parse(cart);
        if (parsedArr.length >= 0) return parsedArr;
      }
    } catch (error) {
      console.debug('Reading cart from local storage failed', error)
    }
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
  RESET: "SU_RESET",
  UPDATE_QUANTITY: "SU_UPDATE_QUANTITY"
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
  user: {cart: []}
})

const updateCartQuantity = (productId, quantity) => ({
  type: actionTypes.UPDATE_QUANTITY,
  productId,
  quantity
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

    try {
      const token = window.localStorage.getItem("token");
      const user = getState().user;
      let cartQuantity;
      let method = 'POST';

      for(let i = 0; i < user.cart.length; i++) {
          if(user.cart[i].id === product.id) {
            method = 'PUT'
            // user.cart[i].quantity++
            cartQuantity = user.cart[i].quantity + 1
            dispatch(updateCartQuantity(product.id, cartQuantity))
          }
        } 

        if(method === 'POST') {
          dispatch(_addToCart(product, quantity));
        }

      if (token) {
        fetch(`/api/users/${user.id}/cart`, {
          method: method,
          headers: {
            authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({orderId: user.cartId, productId: product.id,
          salePrice: product.price, quantity: cartQuantity || 1})
          // body: JSON.stringify(getState().user.cart),
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
    case actionTypes.UPDATE_QUANTITY:
      newState = {
        ...state,
        cart:           
        state.cart.map((p) => {
          if(p.id === action.productId) {
            return {...p, quantity: action.quantity}
          } else {
            return p
          }
        })
      }
      console.log(newState)
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
      if (window) window.localStorage.setItem(cartStorageKey, JSON.stringify([]))
      return action.user;
    default:
      return state;
  }
}
