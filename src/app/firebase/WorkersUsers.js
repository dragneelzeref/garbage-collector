import firebase from "@firebase/app";

import "@firebase/firestore";

import "./Config";

import RandomColor from "randomcolor";

import Snackbar from "react-native-snackbar";

import axios from "axios";

import {
  storeWorker,
  deleteWorker,
  storeUser,
  deleteUser,
  updateTypeAction
} from "../redux/actions/WorkersUsersActions";

const DBUsers = firebase.firestore().collection("users");

export const getWorkers = (props, hideFooterLoading) => {
  DBUsers.where("user_type", "==", "Worker")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        props.dispatch(storeWorker());
        hideFooterLoading();
      }
      snapshot.docs.forEach(doc => {
        props.dispatch(
          storeWorker({
            ...doc.data(),
            backgroundColor: RandomColor(),
            isSelected: false,
            style: {
              backgroundColor: "white"
            }
          })
        );
      });
    });
};

export const getUsers = (props, hideFooterLoading) => {
  DBUsers.where("user_type", "==", "User")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        props.dispatch(storeUser());
        hideFooterLoading();
      }
      snapshot.docs.forEach(doc => {
        props.dispatch(
          storeUser({
            ...doc.data(),
            backgroundColor: RandomColor(),
            isSelected: false,
            style: {
              backgroundColor: "white"
            }
          })
        );
      });
    });
};

//delete workers from firestore
export const deleteWorkers = (props, workers, hideActivityIndicator) => {
  try {
    workers.forEach(worker => {
      if (worker.isSelected) {
        axios
          .post(
            "https://us-central1-garbage-collector-react.cloudfunctions.net/deleteUser",
            {
              user: worker
            }
          )
          .then(() => {
            props.dispatch(deleteWorker(worker));
            hideActivityIndicator();
            Snackbar.show({
              title: "Deleted successfully",
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: "green",
              color: "white"
            });
          });
        // DBUsers.doc(worker.uid)
        //   .delete()
        //   .catch(error => {
        //     console.log(error);
        //   });
        // props.dispatch(deleteWorker(worker));
      }
    });
  } catch (error) {
    console.log(erro);
    hideActivityIndicator();
    Snackbar.show({
      title: "Error while deleting",
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: "red",
      color: "white"
    });
  }
};

export const updateType = (props, user, newType) => {
  try {
    if (user.user_type != newType) {
      DBUsers.doc(user.uid).update({ user_type: newType });
      props.dispatch(updateTypeAction(user, newType));
      Snackbar.show({
        title: "Updated successfully",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "green",
        color: "white"
      });
    }
  } catch (error) {
    Snackbar.show({
      title: "Error while Updateing",
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: "red",
      color: "white"
    });
  }
};
