const WorkersUsersDefaultState = {
  workers: [],
  users: [],
  admins: [],
  mapUidType: []
};

const WorkersUsersReducer = (state = WorkersUsersDefaultState, action) => {
  switch (action.type) {
    case "GET_ALL_USERS":
      if (action.user === null) {
        return WorkersUsersDefaultState;
      } else {
        if (action.user.user_type === "User") {
          let found = false;
          state.users.forEach(user => {
            if (user.uid === action.user.uid) {
              found = true;
            }
          });
          if (found) {
            return state;
          } else {
            return {
              ...state,
              users: [action.user, ...state.users],
              mapUidType: [
                ...state.mapUidType,
                {
                  uid: action.user.uid,
                  type: action.user.user_type
                }
              ]
            };
          }
        }
        if (action.user.user_type === "Worker") {
          let found = false;
          state.workers.forEach(user => {
            if (user.uid === action.user.uid) {
              found = true;
            }
          });
          if (found) {
            return state;
          } else {
            return {
              ...state,
              workers: [action.user, ...state.workers],
              mapUidType: [
                ...state.mapUidType,
                {
                  uid: action.user.uid,
                  type: action.user.user_type
                }
              ]
            };
          }
        }
        if (action.user.user_type === "Admin") {
          let found = false;
          state.admins.forEach(user => {
            if (user.uid === action.user.uid) {
              found = true;
            }
          });
          if (found) {
            return state;
          } else {
            return {
              ...state,
              admins: [action.user, ...state.admins],
              mapUidType: [
                ...state.mapUidType,
                {
                  uid: action.user.uid,
                  type: action.user.user_type
                }
              ]
            };
          }
        }
      }
    case "DELETE_ALL_USERS":
      if (action.user === null) {
        return state;
      } else {
        if (action.user.user_type === "User") {
          var deleteFilter = state.users.filter(user => {
            return user.uid != action.user.uid;
          });
          var deleteMapUidType = state.mapUidType.filter(user => {
            return user.uid != action.user.uid;
          });
          return {
            ...state,
            users: [...deleteFilter],
            mapUidType: [...deleteMapUidType]
          };
        }
        if (action.user.user_type === "Worker") {
          var deleteFilter = state.workers.filter(user => {
            return user.uid != action.user.uid;
          });
          var deleteMapUidType = state.mapUidType.filter(user => {
            return user.uid != action.user.uid;
          });
          return {
            ...state,
            workers: [...deleteFilter],
            mapUidType: [...deleteMapUidType]
          };
        }
        if (action.user.user_type === "Admin") {
          var deleteFilter = state.admins.filter(user => {
            return user.uid != action.user.uid;
          });
          var deleteMapUidType = state.mapUidType.filter(user => {
            return user.uid != action.user.uid;
          });
          return {
            ...state,
            admins: [...deleteFilter],
            mapUidType: [...deleteMapUidType]
          };
        }
      }
    case "UDATE_ALL_USERS":
      if (action.user === null) {
        return state;
      } else {
        let mapped;
        state.mapUidType.forEach(item => {
          if (item.uid === action.user.uid) {
            mapped = item;
          }
        });
        if (mapped) {
          if (mapped.type === "User") {
            if (action.user.user_type === "User") {
              let deleteFilter = state.users.filter(user => {
                return user.uid != action.user.uid;
              });
              return { ...state, usres: [action.user, ...deleteFilter] };
            } else if (action.user.user_type === "Worker") {
              let deleteFilter = state.users.filter(user => {
                return user.uid != action.user.uid;
              });
              let deleteMapUidType = state.mapUidType.filter(user => {
                return user.uid != action.user.uid;
              });
              return {
                ...state,
                users: [...deleteFilter],
                workers: [...state.workers, action.user],
                mapUidType: [
                  ...deleteMapUidType,
                  { uid: action.user.uid, type: action.user.user_type }
                ]
              };
            } else if (action.user.user_type === "Admin") {
              let deleteFilter = state.users.filter(user => {
                return user.uid != action.user.uid;
              });
              let deleteMapUidType = state.mapUidType.filter(user => {
                return user.uid != action.user.uid;
              });
              return {
                ...state,
                users: [...deleteFilter],
                admins: [...state.admins, action.user],
                mapUidType: [
                  ...deleteMapUidType,
                  { uid: action.user.uid, type: action.user.user_type }
                ]
              };
            } else {
              return state;
            }
          }
          if (mapped.type === "Worker") {
            if (action.user.user_type === "User") {
              let deleteFilter = state.workers.filter(user => {
                return user.uid != action.user.uid;
              });
              let deleteMapUidType = state.mapUidType.filter(user => {
                return user.uid != action.user.uid;
              });
              return {
                ...state,
                users: [...state.users, action.user],
                workers: [...deleteFilter],
                mapUidType: [
                  ...deleteMapUidType,
                  { uid: action.user.uid, type: action.user.user_type }
                ]
              };
            } else if (action.user.user_type === "Worker") {
              let deleteFilter = state.workers.filter(user => {
                return user.uid != action.user.uid;
              });
              return { ...state, workers: [action.user, ...deleteFilter] };
            } else if (action.user.user_type === "Admin") {
              let deleteFilter = state.workers.filter(user => {
                return user.uid != action.user.uid;
              });
              let deleteMapUidType = state.mapUidType.filter(user => {
                return user.uid != action.user.uid;
              });
              return {
                ...state,
                workers: [...deleteFilter],
                admins: [...state.admins, action.user],
                mapUidType: [
                  ...deleteMapUidType,
                  { uid: action.user.uid, type: action.user.user_type }
                ]
              };
            } else {
              return state;
            }
          }
          if (mapped.type === "Admin") {
            if (action.user.user_type === "User") {
              let deleteFilter = state.admins.filter(user => {
                return user.uid != action.user.uid;
              });
              let deleteMapUidType = state.mapUidType.filter(user => {
                return user.uid != action.user.uid;
              });
              return {
                ...state,
                users: [...state.users, action.user],
                admins: [...deleteFilter],
                mapUidType: [
                  ...deleteMapUidType,
                  { uid: action.user.uid, type: action.user.user_type }
                ]
              };
            } else if (action.user.user_type === "Worker") {
              let deleteFilter = state.admins.filter(user => {
                return user.uid != action.user.uid;
              });
              let deleteMapUidType = state.mapUidType.filter(user => {
                return user.uid != action.user.uid;
              });
              return {
                ...state,
                workers: [...state.users, action.user],
                admins: [...deleteFilter],
                mapUidType: [
                  ...deleteMapUidType,
                  { uid: action.user.uid, type: action.user.user_type }
                ]
              };
            } else if (action.user.user_type === "Admin") {
              let deleteFilter = state.admins.filter(user => {
                return user.uid != action.user.uid;
              });
              return { ...state, admins: [action.user, ...deleteFilter] };
            } else {
              return state;
            }
          }
        } else {
          return state;
        }
      }
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
          return { ...state, workers: [action.worker, ...state.workers] };
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
          return { ...state, users: [action.user, ...state.users] };
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
          users: [tempUser, ...state.users]
        };
      } else {
        var tempFilter = state.users.filter(worker => {
          return worker.uid != action.user.uid;
        });
        return {
          ...state,
          users: [...tempFilter],
          workers: [tempUser, ...state.workers]
        };
      }
    case "DELETE_WORKER_AND_USER":
      if (action.user.user_type === "Worker") {
        var filterWorkers = state.workers.filter(worker => {
          return worker.uid != action.user.uid;
        });
        return {
          ...state,
          workers: [...filterWorkers]
        };
      } else if (action.user.user_type === "User") {
        var filterWorkers = state.users.filter(worker => {
          return worker.uid != action.user.uid;
        });
        return {
          ...state,
          users: [...filterWorkers]
        };
      } else {
        return state;
      }
    case "MODIFY":
      if (action.user != null) {
        if (action.user.user_type === "User") {
          var filterUsers = state.users.filter(user => {
            return user.uid != action.user.uid;
          });
          return { ...state, users: [action.user, ...filterUsers] };
        } else if (action.user.user_type === "Worker") {
          var filterWorkers = state.workers.filter(worker => {
            return worker.uid != action.user.uid;
          });
          return {
            ...state,
            workers: [action.user, ...filterWorkers]
          };
        }
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default WorkersUsersReducer;
