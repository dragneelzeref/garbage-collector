import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { Header, Input, Avatar } from "react-native-elements";

import { connect } from "react-redux";

import { deleteSingleComplain } from "../../../../NewFirebase/Admin/Complains";

const options = {
  timeZone: "Asia/Kolkata",
  hourCycle: "h12",
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "2-digit"
};

const back = "arrow-back";
const del = "delete";

class ComplainScreen extends Component {
  state = {
    complain: {}
  };
  componentWillMount() {
    let complain = this.props.navigation.getParam("complain", null);
    this.setState({ complain: complain });
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          placement="center"
          leftComponent={{
            icon: back,
            color: "#000",
            onPress: () => this.props.navigation.goBack()
          }}
          centerComponent={
            <Avatar
              rounded
              title={
                this.state.complain.gmail
                  ? this.state.complain.gmail[0].toUpperCase()
                  : "U"
              }
              overlayContainerStyle={{
                backgroundColor: this.state.complain.backgroundColor,
                elevation: 5
              }}
            />
          }
          rightComponent={{
            icon: del,
            color: "black",
            onPress: () => {
              deleteSingleComplain(this.props, this.state.complain);
            }
          }}
          backgroundColor="white"
          statusBarProps={{ backgroundColor: "rgba(0,0,0,0)" }}
          containerStyle={{ elevation: 5 }}
        />
        <KeyboardAvoidingView>
          <View style={styles.cardContainer}>
            <Input
              placeholder="Email"
              leftIcon={
                <Icon
                  name="user"
                  size={24}
                  color="green"
                  style={{ marginRight: 8 }}
                />
              }
              inputContainerStyle={styles.emailInputContainer}
              editable={false}
              value={this.state.complain.gmail}
            />
          </View>
          <View style={styles.cardContainer}>
            <Input
              editable={false}
              placeholder="Complain"
              leftIcon={
                <Icon
                  name="envelope-o"
                  size={24}
                  color="green"
                  style={{ marginRight: 8 }}
                />
              }
              inputContainerStyle={styles.emailInputContainer}
              multiline={true}
              value={this.state.complain.complain}
            />
          </View>
          <View style={styles.cardContainer}>
            <Input
              editable={false}
              placeholder="Date"
              editable={false}
              leftIcon={
                <Icon
                  name="clock-o"
                  size={24}
                  color="green"
                  style={{ marginRight: 8 }}
                />
              }
              inputContainerStyle={styles.emailInputContainer}
              returnKeyType="next"
              value={new Date(this.state.complain.time).toLocaleTimeString(
                "en-US-hc-h12",
                options
              )}
            />
          </View>
          <View style={styles.cardContainer}>
            <Input
              editable={false}
              placeholder="Date"
              editable={false}
              leftIcon={
                <Icon
                  name="calendar-o"
                  size={24}
                  color="green"
                  style={{ marginRight: 8 }}
                />
              }
              inputContainerStyle={styles.emailInputContainer}
              returnKeyType="next"
              value={new Date(this.state.complain.time).toLocaleDateString(
                "en-US-hc-h12",
                options
              )}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    complains: state.complains
  };
};

export default connect(mapStateToProps)(ComplainScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)"
    // justifyContent: "center"
  },
  cardContainer: {
    backgroundColor: "white",
    width: Dimensions.get("screen").width - 16,
    margin: 8,
    borderRadius: 8,
    elevation: 2,
    padding: 8,
    marginBottom: 0
  },
  emailInputContainer: {
    borderBottomWidth: 0
  },
  emailLable: {
    marginRight: 8
  }
});
