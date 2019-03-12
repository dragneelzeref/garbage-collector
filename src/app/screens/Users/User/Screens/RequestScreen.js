import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import Icon from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { Header, Button } from "react-native-elements";

import MapView, { PROVIDER_GOOGLE, Marker, Overlay } from "react-native-maps";

import { connect } from "react-redux";
import {
  setCoords,
  setGpsOn
} from "../../../../redux/actions/LocalLocationActions";
import {
  latitude,
  longitude,
  latitudeDelta,
  longitudeDelta
} from "../../../../redux/reducers/LocalLocation";

import { getCurrentLocation } from "../../../../components/Location/getCurrentLocation";

//header icons start

const HeaderText = () => (
  <Text style={styles.headerText}>Drag marker to the correct location</Text>
);

class RequestScreen extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    region: {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta
    }
  };
  render() {
    return (
      <View style={styles.container}>
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
          }}
          onRegionChangeComplete={this.onRegionChange}
        />
        <Header
          leftComponent={{
            icon: "close",
            color: "#000",
            onPress: () => this.props.navigation.goBack()
          }}
          centerComponent={<HeaderText />}
          rightComponent={{ icon: "check", color: "#000" }}
          backgroundColor="white"
          containerStyle={styles.header}
          statusBarProps={{ backgroundColor: "rgba(0,0,0,0)" }}
        />
        <View style={styles.pin}>
          <FontAwesome name="map-marker" size={40} />
        </View>
        <View style={styles.fabs}>
          <Button
            type="clear"
            icon={
              <MaterialIcons
                name="gps-fixed"
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
              getCurrentLocation(this.props);
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
        </View>
      </View>
    );
  }
  onRegionChange = region => {
    this.setState({ region });
    console.log(region);
  };
}

const mapStateToProps = state => {
  return {
    localLocation: state.localLocation
  };
};

export default connect(mapStateToProps)(RequestScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
    // justifyContent: "center"
  },
  header: {
    elevation: 5
  },
  headerText: {
    textAlign: "center",
    fontSize: 16
  },
  headerOk: {
    fontSize: 16,
    marginRight: 10,
    color: "green"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  pin: {
    position: "absolute",

    top: "44%"
    // marginTop: "-20%"
    // transform: [{ translateX: -15 }]
  },
  fabs: {
    position: "absolute",
    bottom: 10,
    right: 10
  }
});
