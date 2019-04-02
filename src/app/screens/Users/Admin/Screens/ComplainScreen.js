import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar
} from "react-native";
import {
  Button,
  Header,
  ListItem,
  Overlay,
  Card,
  Avatar,
  Input
} from "react-native-elements";

import Icon from "react-native-vector-icons/FontAwesome";

import {
  getComplains,
  deleteComplains,
  readComplain,
  deleteSingleComplain
} from "../../../../firebase/Complains";

import { connect } from "react-redux";

import TouchableScale from "react-native-touchable-scale"; // https://github.com/kohver/react-native-touchable-scale

//icon name constant
const menu = "menu";
const check = "check";
const edit = "edit";
const del = "delete";

class ComplainScreen extends Component {
  state = {
    loading: true,
    complains: [],
    selectedCount: 0,
    leftHeaderIcon: menu,
    rightHeaderIcon: edit,
    refrash: false,
    complainModal: false,
    complainModalDetails: ""
  };
  componentDidMount() {
    getComplains(this.props, this.stopActivityIndicator);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.complains != prevProps.complains) {
      this.setState({ complains: this.props.complains });
    }
    if (prevState.refrash === false && this.state.refrash === true) {
      getComplains(this.props, this.stopActivityIndicator, true);
      this.setState({ refrash: false });
    }
  }

  renderItem = ({ item }) => (
    <ListItem
      Component={TouchableScale}
      friction={90} //
      tension={100} // These props are passed to the parent component (here TouchableScale)
      activeScale={0.95}
      //end Touchable scale

      title={item.complain}
      titleProps={{ numberOfLines: 1 }}
      titleStyle={item.isSelected ? { color: "white" } : { color: "black" }}
      leftAvatar={this.getAvatar(item)}
      subtitle={item.gmail}
      subtitleProps={{ numberOfLines: 1 }}
      subtitleStyle={item.isSelected ? { color: "white" } : { color: "black" }}
      rightTitle={this.formateDate(item)}
      rightTitleStyle={
        item.isSelected ? { color: "white" } : { color: "black" }
      }
      onLongPress={() => {
        this.selectItem(item);
      }}
      onPress={() => {
        this.listOnClick(item);
      }}
      containerStyle={{
        borderRadius: 4,
        marginBottom: 1,
        elevation: 1,
        ...item.style
      }}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <Header
          placement="center"
          leftComponent={{
            icon: this.state.leftHeaderIcon,
            color: "#000",
            onPress: this.headerLeftIconClick
          }}
          centerComponent={{
            text: this.props.navigation.state.routeName,
            style: { color: "#000", fontSize: 16 }
          }}
          rightComponent={{
            icon: this.state.rightHeaderIcon,
            color: "#000",
            onPress: this.hederRightIconClick
          }}
          backgroundColor="white"
          statusBarProps={{ backgroundColor: "rgba(0,0,0,0)" }}
          containerStyle={{ elevation: 5 }}
        />
        <FlatList
          keyExtractor={item => item.id.toString()}
          data={this.state.complains}
          renderItem={this.renderItem}
          extraData={this.state.complains}
          ListFooterComponent={this.renderFooter}
          // onEndReached={() => {
          //   getComplains(this.props, this.stopActivityIndicator);
          // }}
          // onEndReachedThreshold={0}
          style={{ margin: 8, backgroundColor: "rgba(0,0,0,0)" }}
          refreshing={this.state.refrash}
          onRefresh={() => {
            this.setState({ refrash: true });
          }}
        />

        <Overlay
          animated={true}
          animationType="slide"
          isVisible={this.state.complainModal}
          onBackdropPress={() => {
            this.setState({ complainModal: false });
            StatusBar.setBackgroundColor("rgba(0,0,0,0)", true);
          }}
          height="auto"
        >
          <View style={styles.overlayComplain}>
            <View style={styles.overlayAvatarContainer}>
              <Avatar
                rounded
                source={{
                  uri: this.state.complainModalDetails.profile_picture
                }}
                title={this.state.complainModalDetails.title}
                overlayContainerStyle={{
                  backgroundColor: this.state.complainModalDetails
                    .backgroundColor,
                  elevation: 5
                }}
              />
              <Text>{this.state.complainModalDetails.gmail}</Text>
              <Text>{this.formateDate(this.state.complainModalDetails)}</Text>
            </View>
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Complain:
              </Text>
              <Text style={{ marginTop: 8 }}>
                {this.state.complainModalDetails.complain}
              </Text>
            </View>
            <Button
              raised
              containerStyle={{ marginTop: 8 }}
              buttonStyle={{ backgroundColor: "red" }}
              title="Delete"
              onPress={() => {
                deleteSingleComplain(
                  this.props,
                  this.state.complainModalDetails,
                  this.hideOverlay
                );
              }}
            />
          </View>
        </Overlay>
        {/* <Button
          onPress={() => {
            getComplains(this.props, this.stopActivityIndicator);
          }}
          title="Complain"
        /> */}
      </View>
    );
  }

  hideOverlay = () => {
    this.setState({ complainModal: false, complainModalDetails: "" });
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  formateDate = item => {
    return new Date(item.time).toLocaleDateString("en-GB", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  stopActivityIndicator = (load = false) => {
    this.setState({ loading: load });
  };

  getAvatar = item => {
    var tempObj = {
      overlayContainerStyle: { backgroundColor: item.backgroundColor }
    };
    if (item.isSelected) {
      tempObj = { ...tempObj, icon: { name: "check" } };
    } else {
      var tempTitle = item.gmail[0].toUpperCase();
      tempObj = {
        ...tempObj,
        source: { uri: item.profile_picture },
        title: tempTitle
      };
    }
    return tempObj;
  };

  selectItem = item => {
    if (item.isSelected) {
      this.setState({
        selectedCount:
          this.state.selectedCount > 0 ? this.state.selectedCount - 1 : 0
      });
    } else {
      this.setState({
        selectedCount: this.state.selectedCount + 1
      });
    }

    var bg = "white";
    if (item.read) {
      bg = "#ebebeb";
    }

    item.isSelected = !item.isSelected;
    item.style = item.isSelected
      ? { backgroundColor: "green" }
      : { backgroundColor: bg };
    const index = this.state.complains.findIndex(res => res.id === item.id);
    this.state.complains[index] = item;
    this.setState({
      complains: this.state.complains
    });

    //chage header icons
    this.headerLeftIcon();
  };

  listOnClick = complain => {
    if (this.state.leftHeaderIcon === menu) {
      complain.read = true;
      complain.style = complain.read
        ? { backgroundColor: "#ebebeb" }
        : { backgroundColor: "white" };
      const index = this.state.complains.findIndex(
        res => res.id === complain.id
      );
      this.state.complains[index] = complain;
      this.setState(
        {
          complains: this.state.complains,
          complainModal: true,
          complainModalDetails: {
            ...complain,
            title: complain.gmail[0].toUpperCase()
          }
        },
        () => {
          readComplain(complain);
          StatusBar.setBackgroundColor("rgba(0,0,0,0.4)", true);
        }
      );
    } else {
      this.selectItem(complain);
    }
  };

  headerLeftIcon = () => {
    if (this.state.selectedCount === 0) {
      this.setState({ leftHeaderIcon: menu, rightHeaderIcon: edit });
    } else {
      this.setState({ leftHeaderIcon: check, rightHeaderIcon: del });
    }
  };

  headerLeftIconClick = () => {
    if (this.state.leftHeaderIcon === menu) {
      this.props.navigation.openDrawer();
    } else {
      //select all
      if (this.state.complains.length != this.state.selectedCount) {
        this.state.complains.forEach((item, index) => {
          item.isSelected = true;
          item.style = { backgroundColor: "green" };
          // const index = this.state.complains.findIndex(res => res.id === item.id);
          this.state.complains[index] = item;
        });
        this.setState({
          complains: this.state.complains,
          selectedCount: this.state.complains.length
        });
      }

      //diselect all
      else {
        this.state.complains.forEach((item, index) => {
          var bg = "white";
          if (item.read) {
            bg = "#ebebeb";
          }
          item.isSelected = false;

          item.style = { backgroundColor: bg };
          // const index = this.state.complains.findIndex(res => res.id === item.id);
          this.state.complains[index] = item;
        });
        this.setState({
          complains: this.state.complains,
          selectedCount: 0,
          leftHeaderIcon: menu,
          rightHeaderIcon: edit
        });
      }
    }
  };
  hederRightIconClick = () => {
    if (this.state.rightHeaderIcon === edit) {
      this.setState({ leftHeaderIcon: check, rightHeaderIcon: del });
    } else {
      // this.setState({ complains: [] });
      deleteComplains(this.state.complains, this.props);
      this.setState({ leftHeaderIcon: menu, rightHeaderIcon: edit });
      getComplains(this.props, this.stopActivityIndicator);
    }
  };

  refrash = () => {
    this.setState({ refrash: true });
  };
}

const mapStateToProps = state => {
  return {
    complains: state.complains
  };
};

export default connect(mapStateToProps)(ComplainScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)"
  },
  item: {
    backgroundColor: "white"
  },
  selectedItem: {
    backgroundColor: "rgba(0,0,255,0.1)"
  },
  overlayComplain: {
    alignContent: "space-between"
  },
  overlayAvatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
});
