import { createAppContainer, createDrawerNavigator } from "react-navigation";
import HomeScreen from "./Screens/HomeScreen";
import ProfileScreen from "../ProfileScreen";
import CustomeDrawerCompoent from "../CustomeDrawerCompoent";
import ComplainScreen from "./Screens/ComplainScreen";

const Drawer = createDrawerNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Profile: {
      screen: ProfileScreen
    },
    Complains: {
      screen: ComplainScreen
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
