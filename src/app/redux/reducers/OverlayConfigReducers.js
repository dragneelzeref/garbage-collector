const OverlayConfigReducerDefaultState = {
  customeDrawerOverlay: false,
  networkOverlay: false
};

const OverlayConfigReducer = (
  state = OverlayConfigReducerDefaultState,
  action
) => {
  switch (action.type) {
    case "TOGGLE_CUSTOME_DRAWER_OVERLAY":
      if (action.toggle != null) {
        return { ...state, customeDrawerOverlay: action.toggle };
      }
      return { ...state, customeDrawerOverlay: !state.customeDrawerOverlay };
    case "TOGGLE_NETWORK_OVERLAY":
      title = action.title;
      return { ...state, networkOverlay: !state.networkOverlay, title };
    default:
      return state;
  }
};

export default OverlayConfigReducer;
