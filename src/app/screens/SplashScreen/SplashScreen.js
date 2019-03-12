import React, { Component } from "react";
import { View, StatusBar, StyleSheet, Image } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";

class SplashScreen extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.dispatch(this.resetAction);
    }, 2000);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#FFF"
          barStyle="dark-content"
          translucent={true}
        />
        <View>
          <Image
            style={styles.logo}
            source={require("../../../images/logo.png")}
          />
        </View>
      </View>
    );
  }
  resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: "Home" })]
  });
  //network listner
}
export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width: 150,
    height: 150
  }
});
