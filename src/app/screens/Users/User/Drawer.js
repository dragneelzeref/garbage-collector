import React, { Component } from "react";
import {
  createAppContainer,
  createDrawerNavigator,
  createStackNavigator
} from "react-navigation";
import HomeScreen from "./Screens/HomeScreen";
import ComplainScreen from "./Screens/ComplainScreen";
import ProfileScreen from "../ProfileScreen";
import CustomeDrawerCompoent from "../CustomeDrawerCompoent";
import RequestScreen from "./Screens/RequestScreen";

import Icon from "react-native-vector-icons/Entypo";

const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: () => null
    }
  },
  Request: {
    screen: RequestScreen
  }
});

const Drawer = createDrawerNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        drawerIcon: ({ tintColor }) => (
          <Icon name="home" color={tintColor} size={20} />
        )
      }
    },
    Complain: {
      screen: ComplainScreen
    },
    Profile: {
      screen: ProfileScreen
    }
  },
  {
    contentComponent: CustomeDrawerCompoent,
    initialRouteName: "Home",
    drawerType: "slide",
    useNativeAnimations: true,
    contentOptions: {
      activeTintColor: "green",
      activeBackgroundColor: "#FFFFFF",
      inactiveTintColor: "#000000"
    }
  }
);

const DrawerContainer = createAppContainer(Drawer);

export default DrawerContainer;
