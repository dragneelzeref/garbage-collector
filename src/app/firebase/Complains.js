import firebase from "@firebase/app";

import "@firebase/firestore";

import Snackbar from "react-native-snackbar";

export const sendComplain = (email, complain) => {
  firebase
    .firestore()
    .collection("complains")
    .add({ email: email, complain: complain, time: Date.now() })
    .then(() => {
      Snackbar.show({
        title: "Complain sent successfully.",
        duration: Snackbar.LENGTH_LONG
      });
    })
    .catch(() => {
      Snackbar.show({
        title: "Error while complainig try again.",
        duration: Snackbar.LENGTH_LONG
      });
    });
};
