import firebase from "react-native-firebase";

import Snackbar from "react-native-snackbar";

import {
  storeComplain,
  deleteComplain,
  updateComplainAction
} from "../../redux/actions/ComplainAction";

import RandomColor from "randomcolor";

const DBComplain = firebase.firestore().collection("complains");
var getCOmplainsUnsubscriber = null;

export const sendComplain = complain => {
  const docRef = DBComplain.doc();

  docRef
    .set({
      ...complain,
      time: Date.now(),
      read: false,
      id: docRef.id,
      backgroundColor: RandomColor()
    })
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

const limit = 10;

// var numberOfDocuments = null;
// const first = DBComplain.orderBy("time", "desc").limit(limit);
// var next = first;

export const getComplains = (props, stopActivityIndicatore, refash = false) => {
  try {
    getCOmplainsUnsubscriber = DBComplain.orderBy("time", "ASC").onSnapshot(
      snapshot => {
        if (snapshot.empty) {
          props.dispatch(storeComplain());
        } else {
          snapshot.docChanges.forEach(doc => {
            var temp = doc.doc.data();
            var bg = "white";
            if (temp.read) {
              bg = "#ebebeb";
            }

            if (doc.type === "added") {
              props.dispatch(
                storeComplain({
                  ...doc.doc.data(),
                  id: doc.doc.id,
                  isSelected: false,
                  style: {
                    backgroundColor: bg
                  }
                })
              );
            }
            if (doc.type === "modified") {
              props.dispatch(
                updateComplainAction({
                  ...doc.doc.data(),
                  id: doc.doc.id,
                  isSelected: false,
                  style: {
                    backgroundColor: bg
                  }
                })
              );
            }
            if (doc.type === "removed") {
              props.dispatch(deleteComplain({ ...doc.doc.data() }));
            }
          });
        }
        stopActivityIndicatore();
      }
    );
  } catch (error) {
    stopActivityIndicatore();
    Snackbar.show({
      title: "Network Error",
      duration: Snackbar.LENGTH_LONG,
      color: "white",
      backgroundColor: "red"
    });
  }
};

export const unsubscriberComplaines = () => {
  if (getCOmplainsUnsubscriber != null) {
    getCOmplainsUnsubscriber();
  }
};

export const readComplain = complain => {
  DBComplain.doc(complain.id)
    .update({ read: true })
    .catch(error => {
      console.log(error);
    });
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

export const deleteSingleComplain = (props, complain) => {
  try {
    DBComplain.doc(complain.id)
      .delete()
      .then(() => {
        props.dispatch(deleteComplain(complain));
        props.navigation.goBack();
        Snackbar.show({
          title: "Delete successfully.",
          duration: Snackbar.LENGTH_LONG,
          color: "white",
          backgroundColor: "green"
        });
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
