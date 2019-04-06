export const getLoggedInUserInfo = (user = null) => {
  return { type: "GET_LOGGED_IN_USER_INFO", user };
};
export const signOutUser = () => {
  return {
    type: "SIGN_OUT_USER"
  };
};
