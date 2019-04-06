import firebase from "react-native-firebase";

import RandomColor from "randomcolor";

import Snackbar from "react-native-snackbar";

import axios from "axios";

import {
  storeWorker,
  storeUser,
  deleteWorkerAndUserAction,
  updateTypeAction,
  ModifyAction,
  getAllUsersAction,
  deleteAllUsersAction,
  updateAllUsersAction
} from "../../redux/actions/WorkersUsersActions";

const DBUsers = firebase.firestore().collection("users");

var getAllUsersUnsubscriber = null;

export const getAllUsers = (
  props,
  userHideFooterbar = null,
  workerHideFooterbar = null,
  adminHideFooterbar = null
) => {
  try {
    getAllUsersUnsubscriber = DBUsers.onSnapshot(snapshot => {
      if (snapshot.empty) {
        if (userHideFooterbar != null) {
          userHideFooterbar();
        }
        if (workerHideFooterbar != null) {
          workerHideFooterbar();
        }
        if (adminHideFooterbar != null) {
          adminHideFooterbar();
        }
      } else {
        snapshot.docChanges.forEach(change => {
          if (change.type === "added") {
            console.log("add");
            props.dispatch(getAllUsersAction(change.doc.data()));
          } else if (change.type === "modified") {
            console.log("modified");
            props.dispatch(updateAllUsersAction(change.doc.data()));
          } else if (change.type === "removed") {
            console.log("remove");
            props.dispatch(deleteAllUsersAction(change.doc.data()));
          }
          if (userHideFooterbar != null) {
            userHideFooterbar();
          }
          if (workerHideFooterbar != null) {
            workerHideFooterbar();
          }
          if (adminHideFooterbar != null) {
            adminHideFooterbar();
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const unsubscriber = () => {
  if (getAllUsersAction != null) {
    getAllUsersUnsubscriber();
  }
};

// export const getWorkers = (props, hideFooterLoading = null) => {
//   try {
//     DBUsers.where("user_type", "==", "Worker").onSnapshot(snapshot => {
//       if (snapshot.empty) {
//         props.dispatch(storeWorker());
//       } else {
//         snapshot.docChanges.forEach(chage => {
//           if (chage.type === "removed") {
//             console.log("removed");
//             props.dispatch(
//               deleteWorkerAndUserAction({
//                 backgroundColor: RandomColor(),
//                 isSelected: false,
//                 style: {
//                   backgroundColor: "white"
//                 },
//                 ...chage.doc.data()
//               })
//             );
//           }
//           if (chage.type === "added") {
//             console.log("add");
//             props.dispatch(
//               storeWorker({
//                 backgroundColor: RandomColor(),
//                 isSelected: false,
//                 style: {
//                   backgroundColor: "white"
//                 },
//                 ...chage.doc.data()
//               })
//             );
//           }
//           if (chage.type === "modified") {
//             console.log("modify");
//             props.dispatch(
//               ModifyAction({
//                 backgroundColor: RandomColor(),
//                 isSelected: false,
//                 style: {
//                   backgroundColor: "white"
//                 },
//                 ...chage.doc.data()
//               })
//             );
//           }
//         });
//       }
//       if (hideFooterLoading != null) {
//         hideFooterLoading();
//       }
//     });
//   } catch (error) {
//     if (hideFooterLoading != null) {
//       hideFooterLoading();
//     }
//     Snackbar.show({
//       title: "Network error",
//       duration: Snackbar.LENGTH_LONG,
//       backgroundColor: "red",
//       color: "white"
//     });
//   }
// };

// export const getUsers = (props, hideFooterLoading = null) => {
//   try {
//     getWorkersUnsubscriber = DBUsers.where(
//       "user_type",
//       "==",
//       "User"
//     ).onSnapshot(snapshot => {
//       if (snapshot.empty) {
//         props.dispatch(storeWorker());
//       } else {
//         snapshot.docChanges.forEach(chage => {
//           if (chage.type === "added") {
//             console.log("add");
//             props.dispatch(
//               storeUser({
//                 backgroundColor: RandomColor(),
//                 isSelected: false,
//                 style: {
//                   backgroundColor: "white"
//                 },
//                 ...chage.doc.data()
//               })
//             );
//           }
//           if (chage.type === "modified") {
//             console.log("modify");
//             props.dispatch(
//               ModifyAction({
//                 backgroundColor: RandomColor(),
//                 isSelected: false,
//                 style: {
//                   backgroundColor: "white"
//                 },
//                 ...chage.doc.data()
//               })
//             );
//           }
//           if (chage.type === "removed") {
//             console.log("removed");
//             props.dispatch(
//               deleteWorkerAndUserAction({
//                 backgroundColor: RandomColor(),
//                 isSelected: false,
//                 style: {
//                   backgroundColor: "white"
//                 },
//                 ...chage.doc.data()
//               })
//             );
//           }
//         });
//       }
//       if (hideFooterLoading != null) {
//         hideFooterLoading();
//       }
//     });
//   } catch (error) {
//     if (hideFooterLoading != null) {
//       hideFooterLoading();
//     }
//     Snackbar.show({
//       title: "Network error",
//       duration: Snackbar.LENGTH_LONG,
//       backgroundColor: "red",
//       color: "white"
//     });
//   }
// };

//delete workers from firestore
export const deleteWorkerAndUser = (props, workers, hideActivityIndicator) => {
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
            props.dispatch(deleteAllUsersAction(worker));
            hideActivityIndicator();
            Snackbar.show({
              title: "Deleted successfully",
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: "green",
              color: "white"
            });
          });
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

//delete workers from firestore
export const deleteSingleWorkerAndUser = (props, worker) => {
  try {
    axios
      .post(
        "https://us-central1-garbage-collector-react.cloudfunctions.net/deleteUser",
        {
          user: worker
        }
      )
      .then(() => {
        props.dispatch(deleteAllUsersAction(worker));
        props.navigation.goBack();
      });
  } catch (error) {
    console.log(erro);
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
    DBUsers.doc(user.uid).update({ user_type: newType });
    props.dispatch(updateAllUsersAction({ ...user, user_type: newType }));
    Snackbar.show({
      title: "Updated successfully",
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: "green",
      color: "white"
    });
  } catch (error) {
    Snackbar.show({
      title: "Error while Updateing",
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: "red",
      color: "white"
    });
  }
};
