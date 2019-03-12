import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, StatusBar } from "react-native";
import NavIcon from "react-native-vector-icons/Feather";
import AlertIcon from "react-native-vector-icons/MaterialCommunityIcons";

class FloatingHeaderBar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <NavIcon
          name="menu"
          size={24}
          color={"black"}
          onPress={() => {
            this.props.navigation.openDrawer();
          }}
        />
        <Text color="black">{this.props.navigation.state.routeName}</Text>
        <AlertIcon name="bell" size={24} color="black" />
      </View>
    );
  }
}
export default FloatingHeaderBar;

const styles = StyleSheet.create({
  container: {
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
  }
});
