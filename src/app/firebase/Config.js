import firebase from "@firebase/app";

var config = {
  apiKey: "AIzaSyDCSJISj_qpIz75QprSpTa4P9LCidfvFYA",
  authDomain: "garbage-collector-react.firebaseapp.com",
  databaseURL: "https://garbage-collector-react.firebaseio.com",
  projectId: "garbage-collector-react",
  storageBucket: "garbage-collector-react.appspot.com",
  messagingSenderId: "1007982082587"
};
firebase.initializeApp(config);
