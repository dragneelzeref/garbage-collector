import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from "react-native";

import { Button, Avatar } from "react-native-elements";

import { connect } from "react-redux";
import {
  setGpsOn,
  setCoords
} from "../../../../redux/actions/LocalLocationActions";

import Icon from "react-native-vector-icons/Entypo";

import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import NetworkOverlay from "../../NetworkOverlay";
import FloatingHeaderBar from "../../../../components/FloatingHeaderBar";

import { getLocation } from "../../../../components/Location/Listener";

import {
  latitudeDelta,
  longitudeDelta,
  latitude,
  longitude
} from "../../../../redux/reducers/LocalLocation";
import { addWorkerInArea } from "../../../../redux/actions/onlineWorkersAction";

import { getLiveWorkers } from "../../../../NewFirebase/Wokers/onlineWorkers";
import { getPolygons } from "../../../../NewFirebase/Admin/Polygons";

import geolib from "geolib";

var getLiveWorkersUnsubscriber;
var getPolygonsUnsubscriber;

const bus = "directions-bus";

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
    }
  };
  componentDidMount() {
    getLiveWorkersUnsubscriber = getLiveWorkers(this.props);
    getPolygonsUnsubscriber = getPolygons(this.props);
  }
  componentDidUpdate(prevProps) {}

  componentWillUnmount() {
    getLiveWorkersUnsubscriber();
    getPolygonsUnsubscriber();
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
            this.getMyAreaWorker(e.nativeEvent.coordinate);
          }}
        >
          {this.props.onlineWorkers.onlineWorkers.map(
            worker =>
              this.props.onlineWorkers.workersInArea.uid &&
              worker.online && (
                <Marker key={worker.uid} coordinate={worker.last}>
                  <Avatar
                    rounded
                    icon={{ name: bus, color: "black" }}
                    size="small"
                    overlayContainerStyle={{
                      backgroundColor: "rgba(255,255,255,1)"
                    }}
                  />

                  <Callout
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      width: 150
                    }}
                  >
                    <Button
                      buttonStyle={{ backgroundColor: "white" }}
                      titleStyle={{ color: "black" }}
                      title={
                        this.getdistanceBetweenWorkerAndUser(worker) +
                        " Km away"
                      }
                    />
                  </Callout>
                </Marker>
              )
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
              if (this.props.localLocation.coords != null) {
                this.map.animateToRegion(
                  {
                    ...this.state.region,
                    latitude: this.props.localLocation.coords.latitude,
                    longitude: this.props.localLocation.coords.longitude
                  },
                  1000
                );
              }
            }}
          />
          <Button
            type="clear"
            icon={
              <MaterialIcons
                name={"play-for-work"}
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
              this.props.navigation.navigate("Request");
            }}
          />
        </View>
        {/* <NetworkOverlay /> */}
      </SafeAreaView>
    );
  }
  getMyAreaWorker = coordinate => {
    let polygons = this.props.polygons;
    polygons.forEach(polygon => {
      let polygonCoordinates = polygon.coordinates;
      if (geolib.isPointInside(coordinate, polygonCoordinates)) {
        this.props.dispatch(addWorkerInArea(polygon.worker));
      } else {
        console.log("Not in area");
        this.props.dispatch(addWorkerInArea({}));
      }
    });
  };
  getdistanceBetweenWorkerAndUser = worker => {
    let distance = geolib.getDistance(
      worker.last,
      this.props.localLocation.coords
    );
    return distance / 1000;
  };
}

const mapStateToProps = state => {
  return {
    overlays: state.overlays,
    localLocation: state.localLocation,
    onlineWorkers: state.onlineWorkers,
    polygons: state.polygons
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
