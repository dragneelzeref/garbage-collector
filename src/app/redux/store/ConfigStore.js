import { createStore, combineReducers, applyMiddleware } from "redux";

import UserReducer from "../reducers/UserReducer";
import OverlayConfigReducers from "../reducers/OverlayConfigReducers";
import LocalLocation from "../reducers/LocalLocation";
import ComplainReducers from "../reducers/ComplainReducers";
import WorkersUsersReducers from "../reducers/WorkersUsersReducers";

import thunk from "redux-thunk";

export default () => {
  const ConfigStore = createStore(
    combineReducers(
      {
        user: UserReducer,
        overlays: OverlayConfigReducers,
        localLocation: LocalLocation,
        complains: ComplainReducers,
        workersUsers: WorkersUsersReducers
      },
      applyMiddleware(thunk)
    )
  );
  return ConfigStore;
};
