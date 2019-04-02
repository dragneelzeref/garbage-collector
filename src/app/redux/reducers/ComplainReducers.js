const ComplinDefaultState = [];

const ComplainRedcer = (state = ComplinDefaultState, action) => {
  switch (action.type) {
    case "GET_COMPLAINS":
      if (action.complain === null) {
        return ComplinDefaultState;
      } else {
        var found = false;
        state.forEach(complain => {
          if (complain.id === action.complain.id) {
            found = true;
          }
        });
        if (found) {
          return state;
        } else {
          return [...state, action.complain];
        }
      }

    // var include = state.includes(action.complain);
    // if (include) {
    //   return state;
    // } else {
    //   return [...state, action.complain];
    // }
    case "DELETE_COMPLAIN":
      const filterItem = state.filter(item => {
        return item.id != action.item.id;
      });
      return [...filterItem];
    case "REFRASH_COMPLAIN":
      return ComplinDefaultState;
    case "READ_COMPLAIN":
      var tempArray = state.map(complain => {
        if (complain.id === action.complain.id) {
          return { ...complain, read: !complain.read };
        } else {
          return complain;
        }
      });
      console.log(tempArray);
      return tempArray;
    default:
      return state;
  }
};

export default ComplainRedcer;
