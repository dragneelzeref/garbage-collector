import { createStore, combineReducers } from "redux";

import UserReducer from "../reducers/UserReducer";
import OverlayConfigReducers from "../reducers/OverlayConfigReducers";
import LocalLocation from "../reducers/LocalLocation";

export default () => {
  const ConfigStore = createStore(
    combineReducers({
      user: UserReducer,
      overlays: OverlayConfigReducers,
      localLocation: LocalLocation
    })
  );
  return ConfigStore;
};
