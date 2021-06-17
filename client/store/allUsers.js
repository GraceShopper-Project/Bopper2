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
        const users = await fetch('/api/users')
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
  