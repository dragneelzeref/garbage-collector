import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Overlay, Divider } from "react-native-elements";
import { connect } from "react-redux";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";

import AndroidOpenSettings from "react-native-android-open-settings";

const NetworkOverlay = props => {
  return (
    <Overlay
      isVisible={props.overlays.networkOverlay}
      windowBackgroundColor="rgba(0,0,0,0)"
      height={"25%"}
    >
      <View style={styles.container}>
        <Text style={{ fontSize: 16 }}>Turn on Network</Text>
        <View style={styles.networkContainer}>
          <Icons
            name="wifi-strength-1"
            size={35}
            onPress={() => {
              AndroidOpenSettings.wifiSettings();
            }}
          />
          <View
            style={{ borderWidth: 0.5, borderColor: "black", height: "100%" }}
          />
          <Icons
            name="network-strength-1"
            size={35}
            onPress={() => {
              AndroidOpenSettings.generalSettings();
              Andr;
            }}
          />
        </View>
      </View>
    </Overlay>
  );
};
const mapStateToProps = state => {
  return {
    overlays: state.overlays
  };
};
export default connect(mapStateToProps)(NetworkOverlay);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  networkContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: 15,
    width: "100%"
  }
});
