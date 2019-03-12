export const setGpsOn = () => {
  return {
    type: "SET_ON_GPS"
  };
};

export const setGpsOff = () => {
  return {
    type: "SET_OFF_GPS"
  };
};

export const setWatchId = watchId => {
  return {
    type: "SET_WATCH_ID",
    watchId
  };
};

export const setCoords = coords => {
  return {
    type: "SET_COORDS",
    coords
  };
};
