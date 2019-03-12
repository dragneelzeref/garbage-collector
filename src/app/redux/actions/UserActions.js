import { User } from "../../navigation/UserConstants/UserConstant";
export const getLoggedInUserInfo = (user = {}) => {
  return { type: "GET_LOGGED_IN_USER_INFO", user };
};
export const signOutUser = () => {
  return {
    type: "SIGN_OUT_USER"
  };
};
