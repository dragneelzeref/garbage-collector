const onlineWorkerDefaultState = {
  onlineWorkers: [],
  workersInArea: {}
};

const onlineWorkersReducer = (state = onlineWorkerDefaultState, action) => {
  switch (action.type) {
    case "ADD_ONLINE_WORKER":
      let found = false;
      state.onlineWorkers.forEach(worker => {
        if (worker.uid === action.worker.uid) {
          found = true;
        }
      });
      if (found) {
        return state;
      } else {
        return {
          ...state,
          onlineWorkers: [...state.onlineWorkers, action.worker]
        };
      }
    case "UPDATE_ONLINE_WORKER":
      let workerFilter = state.onlineWorkers.filter(worker => {
        return worker.uid != action.worker.uid;
      });
      return { ...state, onlineWorkers: [...workerFilter, action.worker] };
    case "DELETE_ONLINE_WORKER":
      let deleteonlineWrker = state.onlineWorkers.filter(worker => {
        return worker.uid != action.worker.uid;
      });
      return { ...state, onlineWorkers: [...deleteonlineWrker] };
    case "ADD_WORKER_IN_AREA":
      return { ...state, workersInArea: action.worker };
    default:
      return state;
  }
};

export default onlineWorkersReducer;
