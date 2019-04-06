import React from "react";
import {
  createAppContainer,
  createDrawerNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator
} from "react-navigation";
import HomeScreen from "./Screens/HomeScreen";
import ProfileScreen from "../ProfileScreen";
import CustomeDrawerCompoent from "../CustomeDrawerCompoent";
import ComplainScreen from "./Screens/ComplainScreen";

import WorkersScreen from "./Screens/WorkersScreen";
import UsersScreen from "./Screens/UsersScreen";
import AdminScreen from "./Screens/AdminsScreen";

// import Worker from "./Screens/Worker";
import User from "./Screens/User";

import Icon from "react-native-vector-icons/Ionicons";

const UsersTabNavigator = createMaterialTopTabNavigator(
  {
    Users: {
      screen: UsersScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-person" color={tintColor} size={24} />
        )
      }
    },
    Workers: {
      screen: WorkersScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-navigate" color={tintColor} size={24} />
        )
      }
    },
    Admins: {
      screen: AdminScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="md-construct" color={tintColor} size={24} />
        )
      }
    }
  },
  {
    tabBarPosition: "bottom",
    tabBarOptions: {
      activeTintColor: "green",
      inactiveTintColor: "black",
      style: {
        backgroundColor: "white",
        borderRadius: 12,
        elevation: 10
      },
      indicatorStyle: {
        height: 0
      },
      showIcon: true,
      upperCaseLabel: false
    }
  }
);

const Users = createStackNavigator({
  WorkersTab: {
    screen: UsersTabNavigator,
    navigationOptions: {
      header: () => null
    }
  },
  User: {
    screen: User,
    navigationOptions: {
      header: () => null
    }
  }
});

const Drawer = createDrawerNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        drawerIcon: ({ tintColor }) => (
          <Icon name="ios-home" color={tintColor} size={24} />
        )
      }
    },
    Profile: {
      screen: ProfileScreen
    },
    Complains: {
      screen: ComplainScreen,
      navigationOptions: {
        drawerIcon: ({ tintColor }) => (
          <Icon name="ios-send" color={tintColor} size={24} />
        )
      }
    },
    Users: {
      screen: Users,
      navigationOptions: {
        drawerIcon: ({ tintColor }) => (
          <Icon name="ios-people" color={tintColor} size={24} />
        )
      }
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
