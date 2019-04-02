import React, { Component } from "react";
import { View, Text, StyleSheet, Picker } from "react-native";
import { Header, Avatar, Input } from "react-native-elements";

import { connect } from "react-redux";

import { updateType } from "../../../../firebase/WorkersUsers";

const back = "arrow-back";
const check = "check";
const edit = "edit";

class User extends Component {
  state = {
    headerLeftIcon: back,
    headerRightIcon: edit,
    User: null
  };
  componentWillMount() {
    const User = this.props.navigation.getParam("User", null);
    if (User != null) {
      this.setState({ User: User }, () => {
        console.log(this.state.User);
      });
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          placement="center"
          backgroundColor="white"
          leftComponent={{
            icon: this.state.headerLeftIcon,
            onPress: () => {
              this.props.navigation.goBack();
            }
          }}
          centerComponent={
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Avatar
                rounded
                source={{ uri: this.state.User.profile_picture }}
                size={80}
              />
              <Text style={{ padding: 8, fontSize: 16 }}>
                {this.state.User.full_name}
              </Text>
            </View>
          }
          containerStyle={styles.headerContainerStyle}
          statusBarProps={styles.statusBarProps}
        />
        <View style={styles.details}>
          <Input
            editable={false}
            value={this.state.User.first_name}
            label="First Name"
            inputContainerStyle={styles.input}
          />
          <Input
            editable={false}
            value={this.state.User.last_name}
            label="Last Name"
            inputContainerStyle={styles.input}
          />
          <Input
            editable={false}
            value={this.state.User.gmail}
            label="Email"
            inputContainerStyle={styles.input}
          />
          <Input
            editable={false}
            value={this.state.User.city}
            label="City"
            inputContainerStyle={styles.input}
          />
          <Input
            editable={false}
            value={new Date(this.state.User.created_at).toUTCString()}
            label="Created At"
            inputContainerStyle={styles.input}
          />
          <Input
            editable={false}
            value={new Date(this.state.User.last_logged_in).toUTCString()}
            label="Last Logged In"
            inputContainerStyle={styles.input}
          />
          <Input
            label="User Type"
            inputContainerStyle={styles.input}
            inputComponent={Picker}
            selectedValue={this.state.User.user_type}
            mode="dropdown"
            onValueChange={(itemValue, itemIndex) => {
              this.setState({
                User: { ...this.state.User, user_type: itemValue }
              });
              updateType(this.props, this.state.User, itemValue);
            }}
          >
            <Picker.Item value="User" label="User" />
            <Picker.Item value="User" label="User" />
          </Input>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    workersUsers: state.workersUsers
  };
};

export default connect(mapStateToProps)(User);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)"
  },
  headerContainerStyle: {
    elevation: 1,
    height: "auto",
    borderRadius: 4
  },
  statusBarProps: {
    backgroundColor: "rgba(0,0,0,0)"
  },
  details: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    margin: 8,
    elevation: 1,
    fontSize: 14
  },
  input: {
    borderBottomWidth: 0
  }
});
