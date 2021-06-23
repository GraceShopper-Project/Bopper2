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

const setItemQuantityAPI = async (user, product, quantity) => {
  const token = window.localStorage.getItem("token");

  if (! token) return

  try {
    fetch(`/api/users/${user.id}/cart`, {
      method: 'PUT',
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: product.id, quantity })
    });
  } catch (err) {
    console.error(err)
  }
}


/**
 * Action Types
 */
export const actionTypes = {
  SET_USER: "SU_SETUSER",
  ADD_TO_CART: "SU_ADD_TO_CART",
  REMOVE_FROM_CART: "SU_REMOVE_FROM_CART",
  RESET: "SU_RESET",
  UPDATE_QUANTITY: "SU_UPDATE_QUANTITY",
  ADD_ORDER: "SU_ADD_ORDER"
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
  user: {cart: [], orders:[]}
})

const updateCartQuantity = (productId, quantity) => ({
  type: actionTypes.UPDATE_QUANTITY,
  productId,
  quantity
})

const addOrder = (order) => ({
  type: actionTypes.ADD_ORDER,
  order
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
          }
        } 

        if(method === 'POST') {
          dispatch(_addToCart(product, quantity));
        } else {
          dispatch(updateCartQuantity(product.id, cartQuantity))
        }

      if (token) {
        fetch(`/api/users/${user.id}/cart`, {
          method: method,
          headers: {
            authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({productId: product.id, quantity: cartQuantity || 1})
        });
      }
    } catch (err) {
      throw err;
    }
  };

/**
 * Given a product, decrements quantity of that product in cart.
 * If quantity <= 0, removes product entirely.
 */
export const decrementQuantity = (product) => async (dispatch, getState) => {
  const user = getState().user
  const { cart } = user

  const item = cart.filter(p => p.id === product.id)[0]

  if (! item) return

  if (--item.quantity <= 0) {
    dispatch(removeFromCart(product))
    return
  }

  // update state
  dispatch(updateCartQuantity(product.id, item.quantity))
  // update backend
  return setItemQuantityAPI(user, product, item.quantity)
}

export const removeFromCart = (product) => async (dispatch, getState) => {
  dispatch(_removeFromCart(product.id))
  try {
    const token = window.localStorage.getItem("token");
    const userId = getState().user.id;
    if (token) {
      fetch(`/api/users/${userId}/cart/product/${product.id}`, {
        method: "DELETE",
        headers: {
          authorization: token,
        },
      });
    }
  } catch (err) {
    throw err;
  }
}

export const checkout = () => async (dispatch, getState) => {
  try{
    console.log("in checkout thunk")
    const token = window.localStorage.getItem("token");
    const userId = getState().user.id;
    if (token) { 
      const order = await fetch(`/api/users/${userId}/cart/checkout`, {
        method: "GET",
        headers: {
          authorization: token,
        },
      }).then(res => res.json());
      console.log("order in thunk", order)
      dispatch(addOrder(order));
    }
    
  } catch (err) {
    throw err;
  }
}

const initialState = {
  cart: getLocalCart(),
  orders: []
}

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  let newState
  switch (action.type) {
    case actionTypes.SET_USER:
      return {...initialState, ...action.user};
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
      if (window) window.localStorage.setItem(cartStorageKey, JSON.stringify(newState.cart))
      return newState;
    case actionTypes.REMOVE_FROM_CART:
      newState = {
        ...state,
        cart: state.cart.filter((product) => product.id !== action.productId)
      }
      if (window) window.localStorage.setItem(cartStorageKey, JSON.stringify(newState.cart))
      return newState
    case actionTypes.ADD_ORDER:
      console.log("state in reducer", state)
      console.log("order", action.order)
        return {...state, orders: [...state.orders, action.order ]}
    case actionTypes.RESET:
      if (window) window.localStorage.setItem(cartStorageKey, JSON.stringify([]))
      return action.user;
    default:
      return state;
  }
}
