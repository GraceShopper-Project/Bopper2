
/**
 * Action Types
 */
export const actionTypes = {
    SET_USERS: 'AU_SETUSERS',
}

/**
 * Action Creators
 */
const setUsers = (users) => {
    return {
        type: actionTypes.SET_USERS,
        users,
    }
}

/**
 * Thunks
 */
export const fetchUsers = () => async (dispatch) => {
    try {
        const token = window.localStorage.getItem('token')
        if(!token) throw new Error('No Token Found')
        const users = await fetch('/api/users', {
            headers: {
                authorization: token
            }
        })
        dispatch(setUsers(await users.json()))
    } catch (err) {
        throw err
    }
}

/**
 * REDUCER
 */
export default function(state = [], action) {
    switch (action.type) {
        case actionTypes.SET_USERS:
            return action.users;
        default:
            return state
    }
  }
  