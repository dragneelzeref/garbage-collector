import firebase from "react-native-firebase";

import Snackbar from "react-native-snackbar";

import geolib from "geolib";

import {
  storeWorkerPolygonAction,
  modifyWorkerPolygonAction,
  deleteWorkerPolygonAction
} from "../../redux/actions/WorkerPolygonActions";

const DBPolygons = firebase.firestore().collection("polygons");

var WorkerpolygonUnsubscriber;

export const getWorkerPolygons = props => {
  let user = props.user;
  WorkerpolygonUnsubscriber = DBPolygons.onSnapshot(
    snapshot => {
      if (snapshot.empty) {
        //if empty
        props.dispatch(storePolygonAction());
      } else {
        snapshot.docChanges.forEach(chage => {
          const polygon = chage.doc.data();
          if (chage.type === "added") {
            if (user.uid === polygon.worker.uid) {
              console.log("add");

              props.dispatch(storeWorkerPolygonAction(polygon));
            }
          }
          if (chage.type === "modified") {
            if (user.uid === polygon.worker.uid) {
              console.log("modify");

              props.dispatch(modifyWorkerPolygonAction(polygon));
            }
          }
          if (chage.type === "removed") {
            if (user.uid === polygon.worker.uid) {
              console.log("removed");

              props.dispatch(deleteWorkerPolygonAction(polygon));
            }
          }
        });
      }
    },
    erro => {
      props.dispatch(storeWorkerPolygonAction());
      Snackbar.show({
        title: "Network error",
        duration: Snackbar.LENGTH_LONG,
        color: "white",
        backgroundColor: "red"
      });
      console.log(error);
    }
  );
  return WorkerpolygonUnsubscriber;
};
