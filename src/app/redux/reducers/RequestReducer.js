const defaultState = [];

const RequestReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "ADD_REQUEST":
      let found = false;
      state.forEach(request => {
        if (request.rid === action.request.rid) {
          found -= true;
        }
      });
      if (found) {
        return state;
      } else {
        return [...state, action.request];
      }
    case "UPDATE_REQUEST":
      let filterRequest = state.filter(request => {
        return request.rid != action.request.rid;
      });
      return [...filterRequest, action.request];
    case "DELETE_REQUEST":
      let filterRequestUpdaet = state.filter(request => {
        return request.rid != action.request.rid;
      });
      return [...filterRequestUpdaet];
    default:
      return state;
  }
};

export default RequestReducer;
