import React, { Component } from "react";
import { StyleSheet } from "react-native";

import { connect } from "react-redux";

import DrawerUser from "../Users/User/Drawer";
import DrawerWorker from "../Users/Worker/Drawer";
import DrawerAdmin from "../Users/Admin/Drawer";

import {
  Admin,
  Worker,
  User
} from "../../navigation/UserConstants/UserConstant";

import {
  getLocationUpdates,
  removeLocationUpdates
} from "../../components/Location/Listener";

import { getAlreadyLoggedInUser } from "../../NewFirebase/Login/SignInSignOut";

class Home extends Component {
  state = {
    Drawer: DrawerUser
  };

  componentDidMount() {
    this.mapUserWithComponet();
    getLocationUpdates(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.user != prevProps.user) {
      this.mapUserWithComponet();
    }
  }
  componentWillUnmount() {
    removeLocationUpdates();
  }
  render() {
    return <this.state.Drawer />;
  }

  mapUserWithComponet() {
    if (this.props.user.user_type === Admin) {
      this.setState({ Drawer: DrawerAdmin });
    } else if (this.props.user.user_type === Worker) {
      this.setState({ Drawer: DrawerWorker });
    } else {
      this.setState({ Drawer: DrawerUser });
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    overlays: state.overlays,
    localLocation: state.localLocation
  };
};

export default connect(mapStateToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
