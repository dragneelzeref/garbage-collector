const WorkersUsersDefaultState = {
  workers: [],
  users: []
};

const WorkersUsersReducer = (state = WorkersUsersDefaultState, action) => {
  switch (action.type) {
    case "STORE_WORKER":
      if (action.worker === null) {
        return { ...state, workers: WorkersUsersDefaultState.workers };
      } else {
        var found = false;
        state.workers.forEach(user => {
          if (user.uid === action.worker.uid) {
            found = true;
          }
        });
        if (found) {
          return state;
        } else {
          return { ...state, workers: [...state.workers, action.worker] };
        }
      }
    case "STORE_USER":
      if (action.user === null) {
        return { ...state, users: WorkersUsersDefaultState.users };
      } else {
        var found = false;
        state.users.forEach(user => {
          if (user.uid === action.user.uid) {
            found = true;
          }
        });
        if (found) {
          return state;
        } else {
          return { ...state, users: [...state.users, action.user] };
        }
      }
    case "UPDATE_TYPE":
      var tempUser = { ...action.user, user_type: action.newType };

      if (action.user.user_type === "Worker") {
        var tempFilter = state.workers.filter(worker => {
          return worker.uid != action.user.uid;
        });
        return {
          ...state,
          workers: [...tempFilter],
          users: [...state.users, tempUser]
        };
      } else {
        var tempFilter = state.users.filter(worker => {
          return worker.uid != action.user.uid;
        });
        return {
          ...state,
          users: [...tempFilter],
          workers: [...state.workers, tempUser]
        };
      }
    case "DELETE_WORKER":
      if (action.worker.user_type === "Worker") {
        var filterWorkers = state.workers.filter(worker => {
          return worker.uid != action.worker.uid;
        });
        return {
          ...state,
          workers: [...filterWorkers]
        };
      } else {
        var filterWorkers = state.users.filter(worker => {
          return worker.uid != action.worker.uid;
        });
        return {
          ...state,
          users: [...filterWorkers]
        };
      }

    default:
      return state;
  }
};

export default WorkersUsersReducer;
