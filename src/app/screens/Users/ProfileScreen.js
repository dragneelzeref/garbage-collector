import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

import { Text, Header, Avatar, Button, Input } from "react-native-elements";

import Icon from "react-native-vector-icons/FontAwesome";

import AntDesign from "react-native-vector-icons/AntDesign";

import { connect } from "react-redux";

import { signOut, updateData } from "../../firebase/SignInSignOut";

class ProfileScreen extends Component {
  static navigationOptions = {
    drawerLabel: () => null
  };
  state = {
    HeaderLeftIcon: "menu",
    HeaderRightIcon: "edit",
    EditDisable: false,

    firstName: this.props.user.first_name ? this.props.user.first_name : null,
    lastName: this.props.user.last_name ? this.props.user.last_name : null,
    gmail: this.props.user.gmail ? this.props.user.gmail : null,
    city: this.props.user.city ? this.props.user.city : null,

    firstNameError: null,
    lastNameError: null,
    gmailError: null,
    cityError: null
  };
  render() {
    return (
      <View style={styles.container}>
        <Header
          placement="center"
          leftComponent={{
            icon: this.state.HeaderLeftIcon,
            color: "#000",
            onPress: () => {
              this.leftButton();
            }
          }}
          centerComponent={
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Avatar
                rounded
                source={{ uri: this.props.user.profile_picture }}
                size={80}
              />
              <Text style={{ padding: 8, fontSize: 16 }}>
                {this.props.user.full_name}
              </Text>
            </View>
          }
          rightComponent={{
            icon: this.state.HeaderRightIcon,
            color: "black",
            onPress: () => {
              this.rightButton();
            }
          }}
          backgroundColor="white"
          statusBarProps={{ backgroundColor: "rgba(0,0,0,0)" }}
          containerStyle={{ elevation: 5, height: "auto" }}
        />
        {/* first name */}
        <Input
          placeholder="First Name"
          onChangeText={text => {
            this.setState({ firstName: text });
          }}
          onEndEditing={text => {
            if (
              this.state.firstName === "" ||
              this.state.firstName === null ||
              this.state.firstName === undefined
            ) {
              this.setState({ firstNameError: "Please enter first name" });
              this.firstName.shake();
            } else {
              this.setState({ firstNameError: null });
            }
            this.lastName.focus();
          }}
          ref={input => (this.firstName = input)}
          errorMessage={this.state.firstNameError}
          editable={this.state.EditDisable}
          value={this.state.firstName}
          leftIcon={
            <Icon
              name="user-circle-o"
              size={20}
              color="black"
              style={{ marginRight: 8 }}
            />
          }
          inputContainerStyle={styles.inputContainer}
          returnKeyType="next"
        />
        {/* last name */}
        <Input
          placeholder="Last Name"
          onChangeText={text => {
            this.setState({ lastName: text });
          }}
          onEndEditing={text => {
            if (
              this.state.lastName === "" ||
              this.state.lastName === null ||
              this.state.lastName === undefined
            ) {
              this.setState({ lastNameError: "Please enter last name" });
              this.lastName.shake();
            } else {
              this.setState({ lastNameError: null });
            }
            this.city.focus();
          }}
          ref={input => (this.lastName = input)}
          errorMessage={this.state.lastNameError}
          editable={this.state.EditDisable}
          value={this.state.lastName}
          leftIcon={
            <Icon
              name="user-circle"
              size={20}
              color="black"
              style={{ marginRight: 8 }}
            />
          }
          inputContainerStyle={styles.inputContainer}
          returnKeyType="next"
        />
        {/* gmail */}
        <Input
          placeholder="Email"
          onChangeText={text => {
            this.setState({ gmail: text });
          }}
          onTouchEnd={() => {
            alert();
          }}
          ref={input => (this.email = input)}
          errorMessage={this.state.gmailError}
          editable={false}
          value={this.state.gmail}
          leftIcon={
            <Icon
              name="google"
              size={20}
              color="black"
              style={{ marginRight: 8 }}
            />
          }
          inputContainerStyle={styles.inputContainer}
          returnKeyType="next"
        />
        {/* city */}
        <Input
          placeholder="City"
          onChangeText={text => {
            this.setState({ city: text });
          }}
          onEndEditing={text => {
            // this.validateEmail();
            // this.complain.focus();
          }}
          ref={input => (this.city = input)}
          errorMessage={this.state.cityError}
          editable={this.state.EditDisable}
          value={this.state.city}
          leftIcon={
            <Icon
              name="map-marker"
              size={20}
              color="black"
              style={{ marginRight: 8 }}
            />
          }
          inputContainerStyle={styles.inputContainer}
          returnKeyType="go"
          autoCapitalize="words"
        />
        {/* sign out */}
        <Button
          raised
          onPress={() => {
            signOut(this.props);
          }}
          title="Logout"
          containerStyle={styles.signOutButton}
          loading={false}
          buttonStyle={{ backgroundColor: "green" }}
        />
      </View>
    );
  }
  leftButton = () => {
    if (this.state.HeaderLeftIcon === "menu") {
      this.props.navigation.openDrawer();
    } else {
      // discard changes
      this.setState({
        HeaderRightIcon: "edit",
        EditDisable: false,
        HeaderLeftIcon: "menu",
        firstName: this.props.user.first_name
          ? this.props.user.first_name
          : null,
        lastName: this.props.user.last_name ? this.props.user.last_name : null,
        city: this.props.user.city ? this.props.user.city : null
      });
    }
  };
  rightButton = () => {
    if (this.state.HeaderRightIcon === "edit") {
      this.setState({
        HeaderRightIcon: "check",
        EditDisable: true,
        HeaderLeftIcon: "close"
      });
    } else {
      //update data
      this.setState({
        HeaderRightIcon: "edit",
        EditDisable: false,
        HeaderLeftIcon: "menu"
      });
      updateData(this.props, {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        city: this.state.city,
        full_name: this.state.lastName + " " + this.state.firstName
      });
    }
  };
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
    // alignItems: "center",
    // justifyContent: "center"
    backgroundColor: "rgba(0,0,0,0.05)"
  },
  inputContainer: {
    borderBottomWidth: 0,
    marginTop: 8,
    marginHorizontal: 0,
    backgroundColor: "white",
    borderRadius: 4,
    elevation: 2
  },
  signOutButton: {
    marginHorizontal: 8,
    marginTop: 8,
    elevation: 2,
    borderRadius: 8
  }
});
