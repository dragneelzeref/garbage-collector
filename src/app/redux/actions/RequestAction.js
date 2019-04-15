export const storeRequest = request => {
  return {
    type: "ADD_REQUEST",
    request
  };
};
export const updaterequestAction = request => {
  return {
    type: "UPDATE_REQUEST",
    request
  };
};

export const deleteRequest = request => {
  return {
    type: "DELETE_REQUEST",
    request
  };
};
