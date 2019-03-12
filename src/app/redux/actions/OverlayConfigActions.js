export const toggleCustomeDrawerOverlay = () => {
  return {
    type: "TOGGLE_CUSTOME_DRAWER_OVERLAY"
  };
};

export const toggleNetworkOverlay = (title = {}) => {
  return {
    type: "TOGGLE_NETWORK_OVERLAY",
    title
  };
};
