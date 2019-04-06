import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ToastAndroid
} from "react-native";

import { Button, Avatar, Overlay } from "react-native-elements";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AlertIcon from "react-native-vector-icons/MaterialCommunityIcons";

import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Polygon,
  Callout
} from "react-native-maps";

import { connect } from "react-redux";
import {
  setGpsOn,
  setCoords
} from "../../../../redux/actions/LocalLocationActions";
import {
  latitudeDelta,
  longitudeDelta,
  latitude,
  longitude
} from "../../../../redux/reducers/LocalLocation";

import geolib from "geolib";

import NetworkOverlay from "../../NetworkOverlay";

import { getLocation } from "../../../../components/Location/Listener";

import WorkersOverlay from "./WorkersOverlay";

import {
  sendPolygon,
  getPolygons,
  deletePolygon,
  addWorkerToPolygon
} from "../../../../NewFirebase/Admin/Polygons";

const menu = "menu";
const check = "check";
const bell = "bell";
const close = "close";

class HomeScreen extends Component {
  state = {
    region: {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta
    },
    headerLeftIcon: menu,
    headerRightIcon: bell,
    workers: [],

    woverlay: false,
    //polygon

    editing: false,
    editingPolygon: [],
    firstCordinate: false,
    selectedPolygon: []
  };

  componentDidMount() {
    getPolygons(this.props);
  }
  componentDidUpdate(prevProps) {}
  render() {
    const mapOptions = {
      scrollEnabled: true
    };

    if (this.state.editing) {
      mapOptions.scrollEnabled = false;
      mapOptions.onPanDrag = e => this.mapOnPress(e);
    }
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
          showsMyLocationButton={false}
          showsBuildings={true}
          moveOnMarkerPress={true}
          onUserLocationChange={e => {
            this.props.dispatch(setGpsOn());
            this.props.dispatch(setCoords(e.nativeEvent.coordinate));
          }}
          onPress={e => {
            this.mapOnPress(e);
          }}
          zoomControlEnabled={true}
          {...mapOptions}
        >
          {/* saved polygones */
          this.props.polygons.map(polygon => (
            <Polygon
              key={polygon.pid}
              coordinates={polygon.coordinates}
              strokeColor="rgba(0,0,255,0.2)"
              fillColor="rgba(0,0,255,0.2)"
            />
          ))}
          {/* current editing polygon */
          this.state.firstCordinate && (
            <Polygon
              coordinates={this.state.editingPolygon}
              strokeColor="rgba(255,0,0,0.2)"
              fillColor="rgba(255,0,0,0.2)"
            />
          )}
          {/* markers */
          this.props.polygons.map((current, index) => (
            <Marker
              key={current.pid}
              coordinate={current.center}
              calloutOffset={{ x: 0, y: 28 }}
              onDeselect={() => this.setState({ selectedPolygon: {} })}
            >
              <Avatar
                rounded
                source={{
                  uri: current.worker ? current.worker.profile_picture : null
                }}
                icon={{ name: "edit", color: "black" }}
                size="medium"
                overlayContainerStyle={{
                  backgroundColor: "rgba(255,255,255,1)"
                }}
              />
              <Callout
                tooltip
                style={styles.calloutStyle}
                onPress={() => this.polygonMarkerClick(current)}
              >
                <Button
                  buttonStyle={{ backgroundColor: "white" }}
                  titleStyle={{ color: "black" }}
                  title={
                    current.worker ? current.worker.full_name : "Add Worker"
                  }
                />
              </Callout>
            </Marker>
          ))}
        </MapView>
        {/* header */}
        <View style={styles.headerContainer}>
          <MaterialIcons
            name={this.state.headerLeftIcon}
            size={24}
            color={"black"}
            onPress={this.headerLeftIconClick}
          />
          <Text color="black">{this.props.navigation.state.routeName}</Text>
          <AlertIcon
            name={this.state.headerRightIcon}
            size={24}
            color="black"
            onPress={this.headerRightIconClick}
          />
        </View>

        <View style={styles.fabs}>
          {!this.state.editing && (
            <Button
              type="clear"
              icon={
                <MaterialIcons
                  name="add"
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
              onPress={this.addIconClick}
            />
          )}
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

        <Overlay
          animated={true}
          animationType="slide"
          isVisible={this.state.woverlay}
          onBackdropPress={this.overlayBackPress}
          overlayStyle={{ padding: 0 }}
        >
          <WorkersOverlay
            deleteRoute={this.deleteRoute}
            addWorker={this.addWorker}
          />
        </Overlay>
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
  headerLeftIconClick = () => {
    if (this.state.headerLeftIcon === menu) {
      this.props.navigation.openDrawer();
    } else {
      this.setState({
        headerLeftIcon: menu,
        headerRightIcon: bell,
        editing: false,
        editingPolygon: [],
        firstCordinate: false
      });
    }
  };
  headerRightIconClick = () => {
    var temp = geolib.getCenterOfBounds(this.state.editingPolygon);

    if (this.state.headerRightIcon === check) {
      sendPolygon(this.props, this.state.editingPolygon);
      this.setState({
        headerLeftIcon: menu,
        headerRightIcon: bell,
        editing: false,
        editingPolygon: [],
        firstCordinate: false
      });
    }
  };
  addIconClick = () => {
    if (!this.state.editing) {
      this.setState({
        headerLeftIcon: close,
        headerRightIcon: check,
        editing: true
      });
    } else {
      ToastAndroid.show("Plese finish curent route", ToastAndroid.LONG);
    }
  };
  mapOnPress = e => {
    //set polygons
    if (this.state.editing) {
      if (!this.state.firstCordinate) {
        this.setState({
          editingPolygon: [
            ...this.state.editingPolygon,
            e.nativeEvent.coordinate
          ],
          firstCordinate: true
        });
      }
      this.setState({
        editingPolygon: [...this.state.editingPolygon, e.nativeEvent.coordinate]
      });
    }
  };
  polygonMarkerClick = curentPolygon => {
    this.setState({ woverlay: true, selectedPolygon: curentPolygon });
    StatusBar.setBackgroundColor("rgba(0,0,0,0.4)", true);
  };
  overlayBackPress = () => {
    this.setState({ woverlay: false });
    StatusBar.setBackgroundColor("rgba(0,0,0,0)", true);
  };
  deleteRoute = () => {
    if (this.state.selectedPolygon != null) {
      deletePolygon(
        this.props,
        this.state.selectedPolygon,
        this.overlayBackPress
      );
    }
  };
  addWorker = (worker = null) => {
    addWorkerToPolygon(
      this.props,
      this.state.selectedPolygon,
      worker,
      this.overlayBackPress
    );
  };
}

const mapStateToProps = state => {
  return {
    user: state.user,
    workersUsers: state.workersUsers,
    overlays: state.overlays,
    localLocation: state.localLocation,
    polygons: state.polygons
  };
};
export default connect(mapStateToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row-reverse"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    width: Dimensions.get("window").width - 20,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "rgba(0,0,0,0)",
    elevation: 3,
    zIndex: 2,
    backgroundColor: "rgba(255,255,255,0.9)",
    marginTop: StatusBar.currentHeight,
    elevation: 2,
    position: "absolute"
  },
  fabs: {
    // position: "absolute",
    // bottom: 10,
    // right: 10
    alignSelf: "flex-end",
    flexDirection: "column"
  },
  calloutStyle: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0)",
    width: 200
  },
  calloutPopupStyle: {
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
    elevation: 10,
    padding: 15
  }
});
