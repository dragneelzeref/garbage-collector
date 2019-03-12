import React, { Component } from "react";
import { StatusBar, AsyncStorage } from "react-native";

import { DrawerActions } from "react-navigation";

import firebase from "@firebase/app";

import "@firebase/auth";
import "@firebase/firestore";

import { GoogleSignin, statusCodes } from "react-native-google-signin";

import Snackbar from "react-native-snackbar";

import { toggleCustomeDrawerOverlay } from "../redux/actions/OverlayConfigActions";
import { getLoggedInUserInfo, signOutUser } from "../redux/actions/UserActions";

import { Admin, Worker, User } from "../navigation/UserConstants/UserConstant";

import axios from "axios";

import "../screens/Users/Timer";

export const signIn = async props => {
  let user;
  try {
    await GoogleSignin.hasPlayServices();
    const isAlreadySignIn = await GoogleSignin.isSignedIn();

    //not sign in
    if (!isAlreadySignIn) {
      GoogleSignin.signIn().then(
        user => {
          StatusBar.setBackgroundColor("rgba(0,0,0,0.4)", true);
          props.dispatch(toggleCustomeDrawerOverlay());
          const credential = firebase.auth.GoogleAuthProvider.credential(
            user.idToken,
            user.accessToken
          );
          const firebaseUserCredential = firebase
            .auth()
            .signInAndRetrieveDataWithCredential(credential)
            .then(result => {
              //store data for ussingin redux

              if (!result.additionalUserInfo.isNewUser) {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(result.user.uid)
                  .update({ last_logged_in: Date.now() });
              } else {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(result.user.uid)
                  .set({
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
              axios
                .post(
                  "https://us-central1-garbage-collector-react.cloudfunctions.net/getLoggedInUserInfo",
                  { userId: userId }
                )
                .then(result => {
                  AsyncStorage.setItem(
                    "user",
                    JSON.stringify(result.data),
                    error => {
                      console.log(error);
                    }
                  );
                  if (props.user.user_type != result.data.user_type) {
                  } else {
                    if (props.activeItemKey === "Profile") {
                      props.navigation.dispatch(DrawerActions.closeDrawer());
                    } else {
                      props.navigation.navigate("Profile");
                    }
                  }
                  StatusBar.setBackgroundColor("rgba(255,255,255,0)", true);
                  props.dispatch(toggleCustomeDrawerOverlay());
                  props.dispatch(getLoggedInUserInfo(result.data));
                })

                .catch(error => {
                  console.log(error);
                });
            })
            .catch(error => {
              // GoogleSignin.signOut();
              throw error;
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
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      console.log("Cencelled");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      props.dispatch(toggleCustomeDrawerOverlay());
      // operation (f.e. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }
};

export const signOut = props => {
  try {
    if (props.user.gmail) {
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();
      firebase
        .auth()
        .signOut()
        .then(() => {
          props.dispatch(getLoggedInUserInfo());
        })
        .catch(error => {
          console.log(error);
        });

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
      duration: Snackbar.LENGTH_LONG
    });
  }
};
