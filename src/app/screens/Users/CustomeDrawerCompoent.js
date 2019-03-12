import React from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StatusBar,
  ActivityIndicator
} from "react-native";

import { Badge, Avatar, Overlay } from "react-native-elements";

import { DrawerItems, SafeAreaView } from "react-navigation";

import { connect } from "react-redux";

import { signIn } from "../../firebase/SignInSignOut";
// import ignoreWarnings from "react-native-ignore-warnings";

// ignoreWarnings("Setting a timer");

const CustomeDrawerCompoent = props => (
  <ScrollView>
    <SafeAreaView
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <Overlay
        isVisible={props.overlays.customeDrawerOverlay}
        overlayStyle={styles.overlayStyle}
        overlayBackgroundColor="rgba(0,0,0,0)"
        fullScreen={true}
      >
        <ActivityIndicator size="large" color="green" />
      </Overlay>
      <TouchableOpacity
        style={styles.profile}
        onPress={() => {
          signIn(props);
        }}
      >
        <View style={styles.profileContainer}>
          <View style={styles.profileInfo}>
            <Text style={styles.profileInfoName}>
              {props.user.full_name ? props.user.full_name : "Login"}
            </Text>
            <Text style={styles.profileInfoEmail}>{props.user.gmail}</Text>
          </View>
          <View style={styles.profilePicture}>
            <Avatar
              rounded
              source={{ uri: props.user.profile_picture }}
              title="GC"
              avatarStyle={{ backgroundColor: "#FFF" }}
            />
          </View>
        </View>
        <View style={styles.userBadge}>
          <Badge
            value={props.user.user_type}
            status="success"
            badgeStyle={styles.userBadgeText}
          />
        </View>
      </TouchableOpacity>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const mapStateToCustomeDRawerComponent = state => {
  return {
    user: state.user,
    overlays: state.overlays
  };
};

export default connect(mapStateToCustomeDRawerComponent)(CustomeDrawerCompoent);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  profile: {
    backgroundColor: "white",
    justifyContent: "center",
    padding: 16,
    marginTop: StatusBar.currentHeight
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  profileInfo: {},
  profileInfoName: {
    color: "black",
    fontSize: 16,
    fontWeight: "400"
  },
  profileInfoEmail: {
    color: "rgba(0,0,0,0.3)",
    fontSize: 14
  },
  profilePicture: {
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  userBadge: {
    alignSelf: "flex-start",
    paddingTop: 16,
    color: "white"
  },
  userBadgeText: {
    paddingHorizontal: 10,
    backgroundColor: "green"
  },
  overlayStyle: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 0
  }
});
