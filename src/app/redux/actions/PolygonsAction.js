export const storePolygonAction = (polygon = {}) => {
  return {
    type: "STORE_POLYGON",
    polygon: polygon
  };
};
export const modifyPolygonAction = (polygon = {}) => {
  return {
    type: "MODIFY_POLYGON",
    polygon: polygon
  };
};
export const deletePolygonAction = (polygon = {}) => {
  return {
    type: "DELETE_POLYGON",
    polygon: polygon
  };
};
