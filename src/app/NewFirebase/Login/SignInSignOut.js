import { StatusBar, AsyncStorage, YellowBox } from "react-native";

import { DrawerActions } from "react-navigation";

import firebase from "react-native-firebase";

import { GoogleSignin, statusCodes } from "react-native-google-signin";

import Snackbar from "react-native-snackbar";

import { toggleCustomeDrawerOverlay } from "../../redux/actions/OverlayConfigActions";
import {
  getLoggedInUserInfo,
  signOutUser
} from "../../redux/actions/UserActions";

import {
  Admin,
  Worker,
  User
} from "../../navigation/UserConstants/UserConstant";

import "../../screens/Users/Timer";

YellowBox.ignoreWarnings(["Require cycle:"]);

const DBUsers = firebase.firestore().collection("users");

//unsubscribers
var signInUnsubcriber = null;
var getAlreadyLoggedInUserUnsubscriber = null;

export const signIn = async (props, signOut = null) => {
  try {
    await GoogleSignin.hasPlayServices();
    const isAlreadySignIn = await GoogleSignin.isSignedIn();

    //not sign in
    if (!isAlreadySignIn) {
      GoogleSignin.signIn().then(
        user => {
          StatusBar.setBackgroundColor("rgba(0,0,0,0.4)", true);
          props.dispatch(toggleCustomeDrawerOverlay(true));
          const credential = firebase.auth.GoogleAuthProvider.credential(
            user.idToken,
            user.accessToken
          );
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(result => {
              //store data for ussingin redux

              if (!result.additionalUserInfo.isNewUser) {
                DBUsers.doc(result.user.uid).update({
                  last_logged_in: Date.now()
                });
              } else {
                DBUsers.doc(result.user.uid).set({
                  gmail: result.additionalUserInfo.profile.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  first_name: result.additionalUserInfo.profile.given_name,
                  last_name: result.additionalUserInfo.profile.family_name,
                  full_name: result.additionalUserInfo.profile.name,
                  created_at: Date.now(),
                  user_type: User,
                  uid: result.user.uid
                });
              }
              return result.user.uid;
            })
            .then(userId => {
              signInUnsubcriber = DBUsers.doc(userId)
                .get()
                .then(doc => {
                  const data = doc.data();

                  AsyncStorage.setItem(
                    "user",
                    JSON.stringify(doc.data()),
                    error => {
                      console.log(error);
                    }
                  );
                  // .then(() => {
                  // });

                  if (props.user.user_type != data.user_type) {
                  } else {
                    if (props.activeItemKey === "Profile") {
                      props.navigation.dispatch(DrawerActions.closeDrawer());
                    } else {
                      props.navigation.navigate("Profile");
                    }
                  }
                  StatusBar.setBackgroundColor("rgba(255,255,255,0)", true);
                  props.dispatch(toggleCustomeDrawerOverlay(false));
                  props.dispatch(getLoggedInUserInfo(data));
                });
            });
        },
        error => {
          console.log(error);
        }
      );
    } // sign in
    else {
      if (props.activeItemKey === "Profile") {
        props.navigation.dispatch(DrawerActions.closeDrawer());
      } else {
        props.navigation.navigate("Profile");
      }
    }
  } catch (error) {
    props.dispatch(toggleCustomeDrawerOverlay(false));
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      console.log("Cencelled");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (f.e. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
    Snackbar.show({
      title: "Please try again",
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: "red",
      color: "white"
    });
  }
};

export const signOut = props => {
  try {
    if (props.user.gmail) {
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();

      AsyncStorage.clear().then(() => {
        props.dispatch(signOutUser());
        if (props.user.user_type === "User") {
          props.navigation.navigate("Home");
        }
      });
    }
    // Remember to remove the user from your app's state as well
  } catch (error) {
    Snackbar.show({
      title: "Please try again",
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: "red",
      color: "white"
    });
  }
};

export const updateData = (props, data) => {
  if (
    data.first_name === props.user.first_name &&
    data.last_name === props.user.last_name &&
    data.city === props.user.city
  ) {
    return;
  } else {
    DBUsers.doc(props.user.uid)
      .update({ ...data })
      .then(() => {
        props.dispatch(getLoggedInUserInfo(data));
        AsyncStorage.mergeItem("user", JSON.stringify(data));
        Snackbar.show({
          title: "Updated successfully",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "green",
          color: "white"
        });
      })
      .catch(() => {
        Snackbar.show({
          title: "Error while updating",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
          color: "white"
        });
      });
  }
};

export const getAlreadyLoggedInUser = (props, user = null) => {
  if (user === null) return;
  getAlreadyLoggedInUserUnsubscriber = DBUsers.doc(user.uid).onSnapshot(
    doc => {
      props.dispatch(getLoggedInUserInfo(doc.data()));
      AsyncStorage.mergeItem("user", JSON.stringify(doc.data()));
    },
    error => {
      console.log(error);
    }
  );
  return getAlreadyLoggedInUserUnsubscriber;
};
