import React, { Component } from "react";

import { PermissionsAndroid } from "react-native";

import Snackbar from "react-native-snackbar";

import RNAndroidLocationEnabler from "react-native-android-location-enabler";

import AndroidOpenSettings from "react-native-android-open-settings";

import {
  setGpsOn,
  setGpsOff,
  setCoords,
  setWatchId
} from "../../redux/actions/LocalLocationActions";

export const requestLocationPermission = () => {
  const granted = PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );
};

export const getCurrentLocation = props => {
  // requestLocationPermission();
  RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
    // interval: 10000,
    // fastInterval: 5000
    interval: 0,
    fastInterval: 0
  })
    .then(data => {
      // The user has accepted to enable the location services
      // data can be :
      //  - "already-enabled" if the location services has been already enabled
      //  - "enabled" if user has clicked on OK button in the popup
      props.dispatch(setGpsOn());

      // watchLocation(props);

      navigator.geolocation.getCurrentPosition(
        success => {
          props.dispatch(setCoords(success.coords));
        },
        error => {
          console.log(error);
        },
        {
          enableHighAccuracy: true
        }
      );
    })
    .catch(err => {
      // The user has not accepted to enable the location services or something went wrong during the process
      // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
      // codes :
      //  - ERR00 : The user has clicked on Cancel button in the popup
      //  - ERR01 : If the Settings change are unavailable
      //  - ERR02 : If the popup has failed to open
      props.dispatch(setGpsOff());
      Snackbar.show({
        title: "Turn on Location",
        duration: Snackbar.LENGTH_LONG,
        action: {
          title: "Settings",
          color: "white",
          onPress: () => {
            AndroidOpenSettings.locationSourceSettings();
          }
        },
        backgroundColor: "red"
      });
    });
};

export const watchLocation = props => {
  if (
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )
  ) {
    if (props.localLocation.watchId === null) {
      const watchId = navigator.geolocation.watchPosition(
        success => {
          props.dispatch(setCoords(success.coords));
        },
        error => {
          console.log(error);
        },
        {
          enableHighAccuracy: true
        }
      );
      props.dispatch(setWatchId(watchId));
    }
  }
};

export const watchLocationStop = props => {
  navigator.geolocation.clearWatch(props.localLocation.watchId);
};
