import axios from "axios";

import { KEY } from "./key";

export const getMaxTImeToReach = (origin, destination) => {
  let maxTime = 0;
  let maxDistance = 0;
  axios
    .get(
      "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" +
        origin.latitude +
        "," +
        origin.longitude +
        "&destinations=" +
        origin.latitude +
        "," +
        origin.longitude +
        "&departure_time=now&key=" +
        KEY
    )
    .then(responce => {
      console.log(responce);
    });
};
