const ComplinDefaultState = [];

const ComplainRedcer = (state = ComplinDefaultState, action) => {
  switch (action.type) {
    case "GET_COMPLAINS":
      var include = state.includes(action.complain);
      if (include) {
        return state;
      } else {
        return [...state, action.complain];
      }
    case "DELETE_COMPLAIN":
      const filterItem = state.filter(item => {
        return item.id != action.item.id;
      });
      return [...filterItem];
    case "REFRASH_COMPLAIN":
      return ComplinDefaultState;
    default:
      return state;
  }
};

export default ComplainRedcer;
