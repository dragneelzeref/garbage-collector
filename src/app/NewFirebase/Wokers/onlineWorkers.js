import firebase from "react-native-firebase";

import snackbar from "react-native-snackbar";

const DBLiveWorkers = firebase.firestore().collection("liveWorkers");

export const sendLiveLocation = (props, worker = null) => {
  try {
    if (worker != null) {
      DBLiveWorkers.doc(worker.uid).set({ online: true });
    }
  } catch (error) {
    console.log(error);
  }
};

export const stopSendLiveLocation = (props, worker = null) => {
  try {
    if (worker != null) {
      DBLiveWorkers.doc(worker.uid).set({ online: false });
    }
  } catch (error) {
    console.log(error);
  }
};
