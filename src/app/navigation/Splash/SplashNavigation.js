import { createAppContainer, createStackNavigator } from "react-navigation";
import SplashScreen from "../../screens/SplashScreen/SplashScreen";
import Home from "../../screens/Home/Home";

const SplashStack = createStackNavigator(
  {
    Splash: {
      screen: SplashScreen,
      defaultNavigationOptions: {
        header: { visible: false }
      }
    },
    Home: {
      screen: Home
    }
  },
  {
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);
const SplashNavigation = createAppContainer(SplashStack);

export default SplashNavigation;
