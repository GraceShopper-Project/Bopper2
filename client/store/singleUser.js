/**
 * Action Types
 */
export const actionTypes = {
  SET_USER: "SU_SETUSER",
};

/**
 * Action Creators
 */
const setUser = (user) => {
  return {
    type: actionTypes.SET_USER,
    user,
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

/**
 * REDUCER
 */
export default function (state = [], action) {
  switch (action.type) {
    case actionTypes.SET_USER:
      return action.user;
    default:
      return state;
  }
}
