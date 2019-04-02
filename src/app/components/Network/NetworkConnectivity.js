import { NetInfo } from "react-native";

export const getNetworkStatus = () => {
  NetInfo.isConnected.fetch().then(isConnected => {
    return isConnected;
  });
};
