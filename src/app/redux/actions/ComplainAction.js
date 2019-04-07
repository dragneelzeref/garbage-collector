export const storeComplain = (complain = null) => {
  return {
    type: "GET_COMPLAINS",
    complain: complain
  };
};

export const deleteComplain = item => {
  return {
    type: "DELETE_COMPLAIN",
    item: item
  };
};

export const refrashComplains = () => {
  return {
    type: "REFRASH_COMPLAIN"
  };
};

export const readComplainAction = complain => {
  return {
    type: "READ_COMPLAIN",
    complain: complain
  };
};

export const updateComplainAction = complain => {
  return {
    type: "UPDATE_COMPLAIN",
    complain: complain
  };
};
