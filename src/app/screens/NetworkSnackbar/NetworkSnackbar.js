import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

class NetworkSnackbar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>NetworkSnackbar</Text>
      </View>
    );
  }
}
export default NetworkSnackbar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
