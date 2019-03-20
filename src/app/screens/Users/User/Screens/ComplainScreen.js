import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Picker,
  Dimensions,
  KeyboardAvoidingView
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { Header, Input, Card } from "react-native-elements";

import { connect } from "react-redux";

import { sendComplain } from "../../../../firebase/Complains";

class ComplainScreen extends Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Icon name="send" color={tintColor} size={20} />
    )
  };
  state = {
    email: null,
    emailError: null,
    complain: null,
    complainError: null
  };
  componentDidUpdate() {
    console.log(this.state);
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          placement="center"
          leftComponent={{
            icon: "menu",
            color: "#000",
            onPress: this.props.navigation.openDrawer
          }}
          centerComponent={{
            text: this.props.navigation.state.routeName,
            style: { color: "#000", fontSize: 16 }
          }}
          rightComponent={{
            icon: "check",
            color: "green",
            onPress: () => this.sendComplain()
          }}
          backgroundColor="white"
          statusBarProps={{ backgroundColor: "rgba(0,0,0,0)" }}
          containerStyle={{ elevation: 5 }}
        />
        <KeyboardAvoidingView>
          <View style={styles.cardContainer}>
            <Input
              placeholder="Email"
              onChangeText={text => {
                this.setState({ email: text });
              }}
              onEndEditing={text => {
                this.validateEmail();
                this.complain.focus();
              }}
              ref={input => (this.email = input)}
              errorMessage={this.state.emailError}
              leftIcon={
                <Icon
                  name="user"
                  size={24}
                  color="green"
                  style={{ marginRight: 8 }}
                />
              }
              inputContainerStyle={styles.emailInputContainer}
              returnKeyType="next"
              value={this.props.user.gmail}
            />
          </View>
          <View style={styles.cardContainer}>
            <Input
              placeholder="Complain"
              onChangeText={text => {
                this.setState({ complain: text });
              }}
              onEndEditing={text => {
                this.validateComplain();
              }}
              ref={input => (this.complain = input)}
              errorMessage={this.state.complainError}
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
              numberOfLines={3}
              returnKeyType="done"
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
  validateEmail() {
    if (
      this.state.email === null ||
      this.state.email === undefined ||
      this.state.email === ""
    ) {
      this.setState({ emailError: "Please enter email" });
      this.email.shake();
    } else {
      this.setState({ emailError: null });
    }
  }
  validateComplain() {
    if (
      this.state.complain === null ||
      this.state.complain === undefined ||
      this.state.complain === ""
    ) {
      this.setState({ complainError: "Please enter complain" });
      this.complain.shake();
    } else {
      this.setState({ complainError: null });
    }
  }
  sendComplain() {
    this.validateComplain();
    this.validateEmail();
    if (this.state.complainError === null && this.state.emailError === null) {
      sendComplain({
        email: this.state.email,
        complain: this.state.complain,
        ...this.props.user
      });
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    localLocation: state.localLocation
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
