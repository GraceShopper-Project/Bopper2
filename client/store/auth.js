import history from '../history'
import {setUser, reset} from './singleUser'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const SET_AUTH = 'SET_AUTH'

/**
 * ACTION CREATORS
 */
const setAuth = auth => ({type: SET_AUTH, auth})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  const token = window.localStorage.getItem(TOKEN)
  if (token) {
    const res = await fetch('/auth/me', {
      method: 'GET',
      headers: {
        authorization: token
      }
    }).then(data => data.json())
    dispatch(setUser(res))
    return dispatch(setAuth(res))
  }
}

export const authenticate = (username, password, method, email) => async dispatch => {
  try {
    const res = await fetch(`/auth/${method}`,{
      method: 'POST',
      body: {username, password, email}
    }).then(d => d.json())
    window.localStorage.setItem(TOKEN, res.token)
    dispatch(me())
  } catch (authError) {
    return dispatch(setAuth({error: authError}))
  }
}

export const logout = () => (dispatch) =>
{
  window.localStorage.removeItem(TOKEN)
  history.push('/login')
  dispatch(reset())
  return dispatch(setAuth({}))
}

/**
 * REDUCER
 */
export default function(state = {}, action) {
  switch (action.type) {
    case SET_AUTH:
      return action.auth
    default:
      return state
  }
}
