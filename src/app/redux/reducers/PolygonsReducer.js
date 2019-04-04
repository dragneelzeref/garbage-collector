const PolygonsDefaultState = [];

// polygons=[{
//     pid:"id",
//     wid:"id",
//     center:"lat,lag",
//     cordinates:[]
// }]
const PolygonsReducer = (state = PolygonsDefaultState, action) => {
  switch (action.type) {
    case "STORE_POLYGON":
      var found = false;
      state.forEach(polygon => {
        if (polygon.pid === action.polygon.pid) {
          found = true;
        }
      });
      if (found === false && action.polygon.pid) {
        return [...state, action.polygon];
      } else {
        return state;
      }
    case "MODIFY_POLYGON":
      var temp = state.filter(polygon => {
        return polygon.pid != action.polygon.pid;
      });
      if (action.polygon.pid) {
        return [...temp, action.polygon];
      } else {
        return state;
      }
    case "DELETE_POLYGON":
      var temp = state.filter(polygon => {
        return polygon.pid != action.polygon.pid;
      });
      return [...temp];
    default:
      return state;
  }
};

export default PolygonsReducer;
