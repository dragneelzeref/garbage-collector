const defaultState = {};

const WorkerPolygonReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "STORE_POLYGON":
      return action.polygon;
    case "MODIFY_POLYGON":
      return { ...state, ...action.polygon };
    case "DELETE_POLYGON":
      return defaultState;
    default:
      return state;
  }
};

export default WorkerPolygonReducer;
