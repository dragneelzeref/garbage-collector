import firebase from "@firebase/app";

import "@firebase/firestore";

import "./Config";

import Snackbar from "react-native-snackbar";

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
