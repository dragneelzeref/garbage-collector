export const addOnlineWorker = worker => {
  return {
    type: "ADD_ONLINE_WORKER",
    worker
  };
};

export const updateOnlineWorker = worker => {
  return {
    type: "UPDATE_ONLINE_WORKER",
    worker
  };
};

export const deleteOnlineWorker = worker => {
  return {
    type: "DELETE_ONLINE_WORKER",
    worker
  };
};

export const addWorkerInArea = worker => {
  return {
    type: "ADD_WORKER_IN_AREA",
    worker
  };
};
