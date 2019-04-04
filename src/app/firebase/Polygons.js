import firebase from "@firebase/app";

import "@firebase/firestore";

import "./Config";

import RandomColor from "randomcolor";

import Snackbar from "react-native-snackbar";

import geolib from "geolib";

import {
  storePolygonAction,
  modifyPolygonAction,
  deletePolygonAction
} from "../redux/actions/PolygonsAction";

export const getPolygons = props => {
  try {
    firebase
      .firestore()
      .collection("polygons")
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          //if empty
          props.dispatch(storePolygonAction());
        } else {
          console.log("snapshot");
          snapshot.docChanges().forEach(chage => {
            if (chage.type === "added") {
              console.log("add");
              props.dispatch(storePolygonAction({ ...chage.doc.data() }));
            }
            if (chage.type === "modified") {
              console.log("modify");
              props.dispatch(modifyPolygonAction({ ...chage.doc.data() }));
            }
            if (chage.type === "removed") {
              console.log("removed");
              props.dispatch(deletePolygonAction({ ...chage.doc.data() }));
            }
          });
        }
      });
  } catch (error) {
    props.dispatch(storePolygonAction());
    Snackbar.show({
      title: "Network error",
      duration: Snackbar.LENGTH_LONG,
      color: "white",
      backgroundColor: "red"
    });
    console.log(error);
  }
};

export const sendPolygon = (props, coordinates) => {
  try {
    var center = geolib.getCenterOfBounds(coordinates);
    var polyRef = firebase
      .firestore()
      .collection("polygons")
      .doc();

    polyRef.set({ pid: polyRef.id, center: center, coordinates: coordinates });
    props.dispatch(
      storePolygonAction({
        pid: polyRef.id,
        center: center,
        coordinates: coordinates
      })
    );
  } catch (error) {
    Snackbar.show({
      title: "Network error",
      duration: Snackbar.LENGTH_LONG,
      color: "white",
      backgroundColor: "red"
    });
    console.log(error);
  }
};

export const addWorkerToPolygon = (
  props,
  polygon,
  worker = null,
  closeOverlay = null
) => {
  try {
    var polyRef = firebase
      .firestore()
      .collection("polygons")
      .doc(polygon.pid);

    var updata = null;
    if (worker != null) {
      updata = {
        uid: worker.uid,
        full_name: worker.full_name,
        profile_picture: worker.profile_picture,
        gmail: worker.gmail
      };
    }

    polyRef.update({ worker: updata }).then(() => {
      props.dispatch(modifyPolygonAction({ ...polygon, worker: updata }));
      if (closeOverlay != null) {
        closeOverlay();
      }
    });
  } catch (error) {
    Snackbar.show({
      title: "Network error",
      duration: Snackbar.LENGTH_LONG,
      color: "white",
      backgroundColor: "red"
    });
    console.log(error);
  }
};

export const deletePolygon = (props, polygon, closeOverlay = null) => {
  try {
    firebase
      .firestore()
      .collection("polygons")
      .doc(polygon.pid)
      .delete()
      .then(() => {
        props.dispatch(deletePolygonAction(polygon));
        if (closeOverlay != null) {
          closeOverlay();
        }
      });
  } catch (error) {
    Snackbar.show({
      title: "Network error",
      duration: Snackbar.LENGTH_LONG,
      color: "white",
      backgroundColor: "red"
    });
    console.log(error);
  }
};
