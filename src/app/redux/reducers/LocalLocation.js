export const latitudeDelta = 0.0922;
export const longitudeDelta = 0.0421;
export const latitude = 22.2864117;
export const longitude = 70.7719648;

const LocalLocationDefaultState = {
  gps: false,
  coords: null,
  icon: "gps-not-fixed",
  watchId: null
};

const LocalLocation = (state = LocalLocationDefaultState, action) => {
  switch (action.type) {
    case "SET_ON_GPS":
      return { ...state, icon: "gps-fixed", gps: true };
    case "SET_OFF_GPS":
      return { ...state, icon: "gps-not-fixed", gps: false };
    case "SET_COORDS":
      return { ...state, coords: action.coords };
    case "SET_WATCH_ID":
      return { ...state, watchId: action.watchId };
    default:
      return state;
  }
};

export default LocalLocation;
