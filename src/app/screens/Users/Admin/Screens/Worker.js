import React, { Component } from "react";
import { View, Text, StyleSheet, Picker, ScrollView } from "react-native";
import { Header, Avatar, Input, Button } from "react-native-elements";

import { connect } from "react-redux";

import { updateType } from "../../../../firebase/WorkersUsers";

const back = "arrow-back";
const check = "check";
const edit = "edit";

class Worker extends Component {
  state = {
    headerLeftIcon: back,
    headerRightIcon: edit,
    Worker: null
  };
  componentWillMount() {
    const worker = this.props.navigation.getParam("worker", null);
    if (worker != null) {
      this.setState({ Worker: worker });
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
                source={{ uri: this.state.Worker.profile_picture }}
                size={80}
              />
              <Text style={{ padding: 8, fontSize: 16 }}>
                {this.state.Worker.full_name}
              </Text>
            </View>
          }
          containerStyle={styles.headerContainerStyle}
          statusBarProps={styles.statusBarProps}
        />
        <ScrollView>
          <View style={styles.details}>
            <Input
              editable={false}
              value={this.state.Worker.first_name}
              label="First Name"
              inputContainerStyle={styles.input}
            />
            <Input
              editable={false}
              value={this.state.Worker.last_name}
              label="Last Name"
              inputContainerStyle={styles.input}
            />
            <Input
              editable={false}
              value={this.state.Worker.gmail}
              label="Email"
              inputContainerStyle={styles.input}
            />
            <Input
              editable={false}
              value={this.state.Worker.city}
              label="City"
              inputContainerStyle={styles.input}
            />
            <Input
              editable={false}
              value={new Date(this.state.Worker.created_at).toUTCString()}
              label="Created At"
              inputContainerStyle={styles.input}
            />
            <Input
              editable={false}
              value={new Date(this.state.Worker.last_logged_in).toUTCString()}
              label="Last Logged In"
              inputContainerStyle={styles.input}
            />
            <Input
              label="User Type"
              inputContainerStyle={styles.input}
              inputComponent={Picker}
              selectedValue={this.state.Worker.user_type}
              mode="dropdown"
              onValueChange={(itemValue, itemIndex) => {
                this.setState({
                  Worker: { ...this.state.Worker, user_type: itemValue }
                });
                updateType(this.props, this.state.Worker, itemValue);
              }}
            >
              <Picker.Item value="User" label="User" />
              <Picker.Item value="Worker" label="Worker" />
            </Input>
          </View>
          <Button
            title="Delete"
            style={{ padding: 10, color: "white" }}
            containerStyle={{ margin: 8 }}
            buttonStyle={{ backgroundColor: "red" }}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    workersUsers: state.workersUsers
  };
};

export default connect(mapStateToProps)(Worker);

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
