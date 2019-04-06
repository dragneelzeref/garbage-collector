import firebase from "react-native-firebase";

// pluck values from your `google-services.json` file you created on the firebase console
const androidConfig = {
  clientId:
    "1007982082587-0beugqh6nd66renca9756qf8c2091u6m.apps.googleusercontent.com",
  appId: "1:1007982082587:android:bbca466580e154a5",
  apiKey: "AIzaSyBlk16SB7Lq9pat1Gnt5yyBRpWkLGMYAgg",
  databaseURL: "https://garbage-collector-react.firebaseio.com",
  storageBucket: "garbage-collector-react.appspot.com",
  projectId: "garbage-collector-react",

  // enable persistence by adding the below flag
  persistence: false
};

export const init = firebase.initializeApp(androidConfig);

export const Firebase = async () => {
  return await init.onReady().then(App => {
    return App;
  });
};
