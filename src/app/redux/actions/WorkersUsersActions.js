export const storeWorker = (worker = null) => {
  return {
    type: "STORE_WORKER",
    worker: worker
  };
};
export const storeUser = (user = null) => {
  return {
    type: "STORE_USER",
    user: user
  };
};

export const updateTypeAction = (user, newType) => {
  return {
    type: "UPDATE_TYPE",
    user: user,
    newType: newType
  };
};

export const deleteWorkerAndUserAction = user => {
  return {
    type: "DELETE_WORKER_AND_USER",
    user: user
  };
};

export const ModifyAction = (user = null) => {
  return {
    type: "MODIFY",
    user
  };
};

export const getAllUsersAction = (user = null) => {
  return {
    type: "GET_ALL_USERS",
    user
  };
};

export const deleteAllUsersAction = (user = null) => {
  return {
    type: "DELETE_ALL_USERS",
    user
  };
};

export const updateAllUsersAction = (user = null) => {
  return {
    type: "UDATE_ALL_USERS",
    user
  };
};
