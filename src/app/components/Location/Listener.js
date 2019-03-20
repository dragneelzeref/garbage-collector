import { Platform, ToastAndroid, PermissionsAndroid } from "react-native";

import Geolocation from "react-native-geolocation-service";

import {
  setCoords,
  setGpsOn,
  setGpsOff
} from "../../redux/actions/LocalLocationActions";

let WatchId = null;

hasLocationPermission = async () => {
  if (
    Platform.OS === "ios" ||
    (Platform.OS === "android" && Platform.Version < 23)
  ) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (hasPermission) return true;

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show("Location permission denied by user.", ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      "Location permission revoked by user.",
      ToastAndroid.LONG
    );
  }

  return false;
};

export const getLocation = async props => {
  const hasLocationPermission = await this.hasLocationPermission();

  if (!hasLocationPermission) return;

  Geolocation.getCurrentPosition(
    position => {
      //   this.setState({ location: position, loading: false });
      console.log(position);
      if (props.localLocation.gps != true) {
        props.dispatch(setGpsOn());
      }
      props.dispatch(setCoords(position.coords));
      //   props.dispatch(setGpsOn());
    },
    error => {
      //   this.setState({ location: error, loading: false });
      console.log(error);
      props.dispatch(setGpsOff());
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
      distanceFilter: 50,
      showLocationDialog: true
    }
  );
};

export const getLocationUpdates = async props => {
  const hasLocationPermission = await this.hasLocationPermission();

  if (!hasLocationPermission) return;

  WatchId = Geolocation.watchPosition(
    position => {
      //   this.setState({ location: position });
      //   props.dispatch(setCoords(position.coords));
      //   props.dispatch(setGpsOn());
      if (props.localLocation.gps != true) {
        props.dispatch(setGpsOn());
      }
      console.log(position);
    },
    error => {
      //   this.setState({ location: error });

      //   props.dispatch(setGpsOff());
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 0,
      interval: 5000,
      fastestInterval: 2000,
      showLocationDialog: true
    }
  );
};

export const removeLocationUpdates = () => {
  if (this.watchId !== null) {
    Geolocation.clearWatch(this.watchId);
    // this.setState({ updatesEnabled: false })
  }
};
