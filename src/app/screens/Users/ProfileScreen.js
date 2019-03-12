import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import { Button } from "react-native-elements";

import { connect } from "react-redux";

import { signOut } from "../../firebase/SignInSignOut";

class ProfileScreen extends Component {
  static navigationOptions = {
    drawerLabel: () => null
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>ProfileScreen</Text>
        <Button
          title="signOut"
          onPress={() => {
            signOut(this.props);
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
