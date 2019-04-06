/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import { AsyncStorage, NetInfo, ToastAndroid } from "react-native";

import axios from "axios";

import Snackbar from "react-native-snackbar";

import { Provider } from "react-redux";
import { getLoggedInUserInfo } from "./src/app/redux/actions/UserActions";
// import { setCoords } from "./src/app/redux/actions/LocalLocationActions";

import SplashNavigation from "./src/app/navigation/Splash/SplashNavigation";

import "./src/app/firebase/Config";
import "./src/app/firebase/GooglesignInConfig";

//store
import ConfigStore from "./src/app/redux/store/ConfigStore";

import {
  signInSignOutUnsubscriber,
  getAlreadyLoggedInUser
} from "./src/app/NewFirebase/Login/SignInSignOut";

// import {
//   watchLocationStop,
//   watchLocation
// } from "./src/app/components/Location/getCurrentLocation";

const store = ConfigStore();
store.subscribe(() => {
  console.log(store.getState());
});

type Props = {};
export default class App extends Component<Props> {
  componentWillMount() {
    AsyncStorage.getItem("user").then(result => {
      const temp = JSON.parse(result);
      store.dispatch(getLoggedInUserInfo(temp));
    });
  }
  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      handleNetworkConnection
    );
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleNetworkConnection
    );
    signInSignOutUnsubscriber();
    // watchLocationStop(store);
  }
  render() {
    return (
      <Provider store={store}>
        <SplashNavigation />
      </Provider>
    );
  }
}

const handleNetworkConnection = isConnected => {
  if (!isConnected) {
    // Snackbar.show({ title: "No Connection", duration: Snackbar.LENGTH_LONG });

    ToastAndroid.show("No Connection", ToastAndroid.LONG);
    // this.props.dispatch(toggleNetworkOverlay());
    // StatusBar.setBackgroundColor("black");
  } else {
    ToastAndroid.show("Connected", ToastAndroid.LONG);
    // this.props.dispatch(toggleNetworkOverlay());
    // StatusBar.setBackgroundColor("rgba(255,255,255,1)");
    // Snackbar.show({ title: "Connected", duration: Snackbar.LENGTH_LONG });

    AsyncStorage.getItem("user").then(result => {
      const temp = JSON.parse(result);
      if (temp) {
        axios
          .post(
            "https://us-central1-garbage-collector-react.cloudfunctions.net/getLoggedInUserInfo",
            { userId: temp.uid }
          )
          .then(result => {
            store.dispatch(getLoggedInUserInfo(result.data));
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  }
};
