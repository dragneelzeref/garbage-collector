export const storeComplain = complain => {
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
