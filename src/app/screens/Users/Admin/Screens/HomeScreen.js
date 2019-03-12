import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import NetworkOverlay from "../../NetworkOverlay";

class HomeScreen extends Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Icon name="home" color={tintColor} size={20} />
    )
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#FFF"
          barStyle="dark-content"
          translucent={true}
        />
        <Text>HomeScreen</Text>
        <NetworkOverlay />
      </View>
    );
  }
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
