import firebase from "react-native-firebase";

import snackbar from "react-native-snackbar";

import geolib from "geolib";

import RandomColor from "randomcolor";

import {
  addOnlineWorker,
  updateOnlineWorker,
  deleteOnlineWorker
} from "../../redux/actions/onlineWorkersAction";

const DBLiveWorkers = firebase.firestore().collection("liveWorkers");

var getLiveWorkerUnsubscriber;

var lastUpdatedLocation = null;
const minUpdateDistance = 1000; //in meters

const color = RandomColor();

//months 0=jan 11=dec

export const sendLiveLocation = (props, worker = null, coordinates) => {
  try {
    let today = new Date().getDate();

    const docRef = DBLiveWorkers.doc(worker.uid);

    docRef.get().then(
      doc => {
        //check doc exist or not
        if (doc.exists) {
          let document = doc.data();
          let timestampDay = new Date(document.last.timestamp).getDate();
          //check last updated today?
          if (timestampDay === today) {
            //1st time set data
            if (lastUpdatedLocation === null) {
              docRef.update({ last: coordinates, online: true });
              lastUpdatedLocation = coordinates;
            }
            //other time filter based on time
            else {
              let distance = geolib.getDistance(
                lastUpdatedLocation,
                coordinates
              );
              //distance to update is > min
              if (distance >= minUpdateDistance) {
                docRef.update({
                  last: coordinates,
                  online: true,
                  wayPoints: firebase.firestore.FieldValue.arrayUnion(
                    coordinates
                  )
                });
              }
              //not >
              else {
                docRef.update({
                  last: coordinates,
                  online: true
                });
              }
            }
          }
          //if not then set waypoints to [] with 1 current cordinate
          else {
            docRef.update({
              last: coordinates,
              online: true,
              wayPoints: [coordinates]
            });
          }
        } else {
          //create new document if not exist
          docRef.set({
            last: coordinates,
            online: true,
            uid: worker.uid,
            profile_picture: worker.profile_picture,
            full_name: worker.full_name,
            color: color,
            wayPoints: [coordinates]
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const stopSendLiveLocation = (props, worker = null) => {
  try {
    if (worker != null) {
      DBLiveWorkers.doc(worker.uid).update({ online: false });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getLiveWorkers = props => {
  getLiveWorkerUnsubscriber = DBLiveWorkers.onSnapshot(
    snapshot => {
      snapshot.docChanges.forEach(doc => {
        let data = doc.doc.data();
        if (doc.type === "added") {
          props.dispatch(addOnlineWorker(data));
        }
        if (doc.type === "modified") {
          props.dispatch(updateOnlineWorker(data));
        }
        if (doc.type === "removed") {
          props.dispatch(deleteOnlineWorker(data));
        }
      });
    },
    error => {
      console.log(error);
    }
  );
  return getLiveWorkerUnsubscriber;
};
