export const toggleCustomeDrawerOverlay = (toggle = null) => {
  return {
    type: "TOGGLE_CUSTOME_DRAWER_OVERLAY",
    toggle: toggle
  };
};

export const toggleNetworkOverlay = (title = {}) => {
  return {
    type: "TOGGLE_NETWORK_OVERLAY",
    title
  };
};
