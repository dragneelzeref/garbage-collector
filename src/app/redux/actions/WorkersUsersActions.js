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

export const deleteWorker = worker => {
  return {
    type: "DELETE_WORKER",
    worker: worker
  };
};
