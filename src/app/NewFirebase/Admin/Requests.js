import firebase from "react-native-firebase";

import {
  storeRequest,
  updaterequestAction,
  deleteRequest
} from "../../redux/actions/RequestAction";

import Snackbar from "react-native-snackbar";

const DBRequests = firebase.firestore().collection("requests");

export const getRequests = props => {
  const getRequestUnsubscriberr = DBRequests.onSnapshot(
    snap => {
      snap.docChanges.forEach(doc => {
        if (doc.type === "added") {
          props.dispatch(storeRequest(doc.doc.data()));
        }
        if (doc.type === "modified") {
          props.dispatch(updaterequestAction(doc.doc.data()));
        }
        if (doc.type === "removed") {
          props.dispatch(deleteRequest(doc.doc.data()));
        }
      });
    },
    error => {
      console.log(error);
    }
  );
  return getRequestUnsubscriberr;
};

export const sendRequest = coordinates => {
  const docRef = DBRequests.doc();
  docRef
    .set({
      rid: docRef.id,
      coordinates: coordinates,
      resolved: false,
      timestamp: new Date()
    })
    .then(
      () => {
        Snackbar.show({
          title: "Send",
          duration: Snackbar.LENGTH_LONG,
          color: "white",
          backgroundColor: "green"
        });
      },
      error => {
        Snackbar.show({
          title: "Error",
          duration: Snackbar.LENGTH_LONG,
          color: "white",
          backgroundColor: "green"
        });
      }
    );
};

export const updateRequestStatus = request => {
  DBRequests.doc(request.rid).update({ resolved: true });
};
