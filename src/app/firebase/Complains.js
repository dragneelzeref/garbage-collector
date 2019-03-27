import firebase from "@firebase/app";

import "@firebase/firestore";

import "./Config";

import Snackbar from "react-native-snackbar";

import {
  storeComplain,
  deleteComplain,
  refrashComplains
} from "../redux/actions/ComplainAction";

import RandomColor from "randomcolor";

const DBComplain = firebase.firestore().collection("complains");

export const sendComplain = complain => {
  DBComplain.add({ ...complain, time: Date.now() })
    .then(() => {
      Snackbar.show({
        title: "Complain sent successfully.",
        duration: Snackbar.LENGTH_LONG,
        color: "white",
        backgroundColor: "green"
      });
    })
    .catch(() => {
      Snackbar.show({
        title: "Error while complainig try again.",
        duration: Snackbar.LENGTH_LONG,
        color: "white",
        backgroundColor: "red"
      });
    });
};

//complain pagging

const limit = 1;

var numberOfDocuments = null;
const first = DBComplain.orderBy("time", "desc").limit(limit);
var next = first;

export const getComplains = (props, stopActivityIndicatore, refash = false) => {
  if (refash) {
    next = first;
    props.dispatch(refrashComplains);
  }

  if (next === null || undefined || "") return;

  next.get().then(
    snapshot => {
      //last document
      var lastVisible = snapshot.docs[snapshot.docs.length - 1];
      //current page documents
      snapshot.docs.forEach(doc => {
        var temp = doc.data();
        props.dispatch(
          storeComplain({
            ...temp,
            id: doc.id,
            backgroundColor: RandomColor(),
            isSelected: false,
            style: {
              backgroundColor: "white"
            }
          })
        );
        // console.log(doc.data());
      });
      //update next to page end
      if (lastVisible != undefined) {
        next = DBComplain.orderBy("time", "desc")
          .startAfter(lastVisible)
          .limit(limit);
      } else {
        next = null;
        stopActivityIndicatore();
      }
    },
    reason => {
      console.log(reason);
    }
  );
};

export const deleteComplains = (complains, props) => {
  try {
    complains.forEach(item => {
      if (item.isSelected === true) {
        DBComplain.doc(item.id)
          .delete()
          .then(() => {
            console.log("Document successfully deleted!");
            props.dispatch(deleteComplain(item));
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
    Snackbar.show({
      title: "Delete successfully.",
      duration: Snackbar.LENGTH_LONG,
      color: "white",
      backgroundColor: "green"
    });
  } catch (error) {
    Snackbar.show({
      title: "Error while delete try again.",
      duration: Snackbar.LENGTH_LONG,
      color: "white",
      backgroundColor: "red"
    });
  }
};
