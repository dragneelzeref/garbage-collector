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

import { Button } from "react-native-elements";

import { connect } from "react-redux";
import {
  setGpsOn,
  setCoords
} from "../../../../redux/actions/LocalLocationActions";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AlertIcon from "react-native-vector-icons/MaterialCommunityIcons";

import MapView, { PROVIDER_GOOGLE, Marker, Polygon } from "react-native-maps";

import NetworkOverlay from "../../NetworkOverlay";

import { getLocation } from "../../../../components/Location/Listener";

import {
  latitudeDelta,
  longitudeDelta,
  latitude,
  longitude
} from "../../../../redux/reducers/LocalLocation";

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
    //polygon

    polygons: [],
    editing: false,
    currentPolygon: [],
    firstCordinate: false
  };
  componentDidUpdate(prevProps) {
    // if (prevProps.localLocation.coords != this.props.localLocation.coords) {
    //   this.moveRegion(this.props.localLocation.coords);
    // }
  }
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
          this.state.polygons.map((polygon, index) => (
            <Polygon
              key={index}
              coordinates={polygon}
              strokeColor="rgba(0,0,255,0.2)"
              fillColor="rgba(0,0,255,0.2)"
            />
          ))}
          {/* current editing polygon */
          this.state.firstCordinate && (
            <Polygon
              coordinates={this.state.currentPolygon}
              strokeColor="rgba(255,0,0,0.2)"
              fillColor="rgba(255,0,0,0.2)"
            />
          )}
        </MapView>
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
        currentPolygon: [],
        firstCordinate: false
      });
    }
  };
  headerRightIconClick = () => {
    if (this.state.headerRightIcon === check) {
      this.setState({
        headerLeftIcon: menu,
        headerRightIcon: bell,
        editing: false,
        polygons: [...this.state.polygons, this.state.currentPolygon],
        currentPolygon: [],
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
          currentPolygon: [
            ...this.state.currentPolygon,
            e.nativeEvent.coordinate
          ],
          firstCordinate: true
        });
      }
      this.setState({
        currentPolygon: [...this.state.currentPolygon, e.nativeEvent.coordinate]
      });
    }
  };
}

const mapStateToProps = state => {
  return {
    overlays: state.overlays,
    localLocation: state.localLocation
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
  }
});
