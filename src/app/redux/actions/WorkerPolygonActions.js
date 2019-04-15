export const storeWorkerPolygonAction = (polygon = {}) => {
  return {
    type: "STORE_POLYGON",
    polygon: polygon
  };
};
export const modifyWorkerPolygonAction = (polygon = {}) => {
  return {
    type: "MODIFY_POLYGON",
    polygon: polygon
  };
};
export const deleteWorkerPolygonAction = (polygon = {}) => {
  return {
    type: "DELETE_POLYGON",
    polygon: polygon
  };
};
