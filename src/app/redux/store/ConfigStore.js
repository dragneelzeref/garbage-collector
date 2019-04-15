import { createStore, combineReducers, applyMiddleware } from "redux";

import UserReducer from "../reducers/UserReducer";
import OverlayConfigReducers from "../reducers/OverlayConfigReducers";
import LocalLocation from "../reducers/LocalLocation";
import ComplainReducers from "../reducers/ComplainReducers";
import WorkersUsersReducers from "../reducers/WorkersUsersReducers";
import PolygonsReducer from "../reducers/PolygonsReducer";
import onlineWorkersReducer from "../reducers/onlineWorkersReducer";
import RequestReducer from "../reducers/RequestReducer";
import WorkerPolygonReducer from "../reducers/WorkerPolygonReducer";

import thunk from "redux-thunk";

export default () => {
  const ConfigStore = createStore(
    combineReducers(
      {
        user: UserReducer,
        overlays: OverlayConfigReducers,
        localLocation: LocalLocation,
        complains: ComplainReducers,
        workersUsers: WorkersUsersReducers,
        polygons: PolygonsReducer,
        onlineWorkers: onlineWorkersReducer,
        requests: RequestReducer,
        workerPolygon: WorkerPolygonReducer
      },
      applyMiddleware(thunk)
    )
  );
  return ConfigStore;
};
