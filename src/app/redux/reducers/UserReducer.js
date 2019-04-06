import { User } from "../../navigation/UserConstants/UserConstant";

const UserReduerDefaultState = { user_type: User };

const UserReduer = (state = UserReduerDefaultState, action) => {
  switch (action.type) {
    case "GET_LOGGED_IN_USER_INFO":
      if (action.user === null) {
        return UserReduerDefaultState;
      }
      return { ...state, ...action.user };
    case "SIGN_OUT_USER":
      return UserReduerDefaultState;
    default:
      return state;
  }
};

export default UserReduer;
