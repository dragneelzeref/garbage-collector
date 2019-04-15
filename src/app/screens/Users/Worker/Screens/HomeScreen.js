import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from "react-native";

import { Button } from "react-native-elements";

import { connect } from "react-redux";
import {
  setGpsOn,
  setCoords
} from "../../../../redux/actions/LocalLocationActions";

import Icon from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import MapView, { PROVIDER_GOOGLE, Marker, Polygon } from "react-native-maps";

import MapViewDirections from "react-native-maps-directions";

import { KEY } from "../../../../APIS/key";

import geolib from "geolib";

import NetworkOverlay from "../../NetworkOverlay";
import FloatingHeaderBar from "../../../../components/FloatingHeaderBar";

import { getLocation } from "../../../../components/Location/Listener";

import {
  sendLiveLocation,
  stopSendLiveLocation,
  getLiveWorkers
} from "../../../../NewFirebase/Wokers/onlineWorkers";
import { getPolygons } from "../../../../NewFirebase/Admin/Polygons";
import { getWorkerPolygons } from "../../../../NewFirebase/Wokers/WorkerPolygon";

import {
  latitudeDelta,
  longitudeDelta,
  latitude,
  longitude
} from "../../../../redux/reducers/LocalLocation";

import { getRequests } from "../../../../NewFirebase/Admin/Requests";

var getPolygonsUnsubscriber;
var getWorkerPolygonsUnsubscriber;
var getRequestsUnsubscriber;

class HomeScreen extends Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Icon name="home" color={tintColor} size={20} />
    )
  };
  state = {
    region: {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta
    },
    lastUpdetedCoordinate: null,
    minDistance: 100, //in meter,
    myPolygon: null,
    destination: null
  };
  componentDidMount() {
    // getPolygonsUnsubscriber = getPolygons(this.props);
    getRequestsUnsubscriber = getRequests(this.props);
    getWorkerPolygonsUnsubscriber = getWorkerPolygons(this.props);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.localLocation.coords != this.props.localLocation.coords) {
      this.moveRegion(this.props.localLocation.coords);
    }
  }
  componentWillUnmount() {
    if (this.props.user.user_type === "Worker") {
      stopSendLiveLocation(this.props, this.props.user);
    }
    // getPolygonsUnsubscriber();
    getRequestsUnsubscriber();
    getWorkerPolygonsUnsubscriber();
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor="rgba(0,0,0,0)"
          barStyle="dark-content"
          translucent={true}
        />

        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          ref={ref => {
            this.map = ref;
          }}
          initialRegion={this.state.region}
          showsUserLocation
          showsBuildings={true}
          onUserLocationChange={e => {
            this.props.dispatch(setGpsOn());
            this.props.dispatch(setCoords(e.nativeEvent.coordinate));
            if (this.props.user.user_type === "Worker") {
              sendLiveLocation(
                this.props,
                this.props.user,
                e.nativeEvent.coordinate
              );
            }
          }}
        >
          {/* {this.props.polygons.map(
            polygon =>
              polygon.worker.uid === this.props.user.uid && (
                <Polygon
                  key={polygon.pid}
                  coordinates={polygon.coordinates}
                  strokeColor="rgba(0,0,255,0.2)"
                  fillColor="rgba(0,0,255,0.2)"
                />
              )
          )} */}
          {this.props.workerPolygon.pid && (
            <Polygon
              coordinates={this.props.workerPolygon.coordinates}
              strokeColor="rgba(0,0,255,0.2)"
              fillColor="rgba(0,0,255,0.2)"
            />
          )}
          {/* requests */}
          {this.props.requests.map(
            request =>
              this.props.workerPolygon.pid &&
              (geolib.isPointInside(
                request.coordinates,
                this.props.workerPolygon.coordinates
              ) && (
                <Marker key={request.rid} coordinate={request.coordinates}>
                  <FontAwesome name="map-marker" size={20} />
                </Marker>
              ))
          )}
          {this.state.destination && (
            <MapViewDirections
              apikey={KEY}
              origin={this.props.localLocation.coords}
              destination={this.state.destination}
              strokeWidth={3}
              strokeColor="hotpink"
            />
          )}
        </MapView>
        <FloatingHeaderBar {...this.props} />
        <View style={styles.fabs}>
          <Button
            type="clear"
            icon={
              <MaterialIcons
                name={this.props.localLocation.icon}
                size={25}
                color="black"
                style={{
                  backgroundColor: "white",
                  padding: 15,
                  borderRadius: 35,
                  elevation: 10
                }}
              />
            }
            onPress={() => {
              getLocation(this.props);
              this.moveRegion(this.props.localLocation.coords);
            }}
          />
        </View>
        {/* <NetworkOverlay /> */}
      </SafeAreaView>
    );
  }
  moveRegion = location => {
    if (location != null) {
      this.map.animateToRegion(
        {
          ...this.state.region,
          latitude: location.latitude,
          longitude: location.longitude
        },
        1000
      );
    }
  };
  findNearestPolygonPoint = () => {
    let polygon = this.props.workerPolygon;
    min = Number.POSITIVE_INFINITY;
    let c = null;
    polygon.coordinates.forEach(coordinate => {
      let dist = geolib.getDistance(
        coordinate,
        this.props.localLocation.coords
      );
      if (dist < min) {
        min = dist;
        c = coordinate;
      }
    });
    this.setState({ destination: c });
  };
}

const mapStateToProps = state => {
  return {
    overlays: state.overlays,
    user: state.user,
    localLocation: state.localLocation,
    onlineWorkers: state.onlineWorkers,
    // polygons: state.polygons,
    workerPolygon: state.workerPolygon,
    requests: state.requests
  };
};
export default connect(mapStateToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  fabs: {
    position: "absolute",
    bottom: 10,
    right: 10
  }
});
