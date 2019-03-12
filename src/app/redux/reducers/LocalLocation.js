export const latitudeDelta = 0.0015;
export const longitudeDelta = 0.00121;
export const latitude = 22.29691;
export const longitude = 70.79836;

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
