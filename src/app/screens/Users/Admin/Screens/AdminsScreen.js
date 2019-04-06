import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Modal,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { Header, ListItem, Button, SearchBar } from "react-native-elements";

import { connect } from "react-redux";

import TouchableScale from "react-native-touchable-scale"; // https://github.com/kohver/react-native-touchable-scale

import {
  getAllUsers,
  deleteWorkerAndUser,
  unsubscriber
} from "../../../../NewFirebase/Admin/WorkersUsers";

import Snackbar from "react-native-snackbar";

//icon name constant
const menu = "menu";
const check = "check";
const edit = "edit";
const del = "delete";

class AdminScreen extends Component {
  state = {
    headerLeftIcon: menu,
    headerRightIcon: edit,
    refresh: false,
    admins: [],
    selectedCount: 0,
    processModel: false,
    footerLoading: true,
    SearchText: null
  };
  componentDidMount() {
    getAllUsers(this.props, this.hideFooterLoading);
  }
  componentDidUpdate(prevProps) {
    if (this.state.admins != this.props.workersUsers.admins) {
      this.setState({
        admins: this.props.workersUsers.admins,
        footerLoading: false
      });
    }
  }
  componentWillUnmount() {
    unsubscriber();
  }

  renderItem = ({ item }) => (
    <ListItem
      Component={TouchableScale}
      friction={90} //
      tension={100} // These props are passed to the parent component (here TouchableScale)
      activeScale={0.95}
      //end Touchable scale

      title={item.full_name}
      titleProps={{ numberOfLines: 1 }}
      titleStyle={item.isSelected ? { color: "white" } : { color: "black" }}
      leftAvatar={
        item.isSelected
          ? { icon: { name: check } }
          : { source: { uri: item.profile_picture } }
      }
      subtitle={item.gmail || item.email}
      subtitleProps={{ numberOfLines: 1 }}
      subtitleStyle={item.isSelected ? { color: "white" } : { color: "black" }}
      chevron={true}
      onLongPress={() => {
        this.listLongPress(item);
      }}
      onPress={() => {
        this.listOnPress(item);
      }}
      containerStyle={{
        borderRadius: 4,
        marginBottom: 1,
        elevation: 1,
        ...item.style
      }}
    />
  );
  renderSearch = () => (
    <SearchBar
      lightTheme={true}
      placeholder="Search"
      inputContainerStyle={{ backgroundColor: "white" }}
      containerStyle={{
        backgroundColor: "transparent",
        padding: 0,
        borderWidth: 0
      }}
      value={this.state.SearchText}
      onChangeText={text => {
        this.setState({ SearchText: text }, () => {
          if (text != "" || null) {
            const temp = this.state.admins.filter(worker => {
              return (worker.full_name
                .toLowerCase()
                .search(text.toLowerCase()) ||
                worker.gmail.toLowerCase().search(text.toLowerCase())) != -1
                ? true
                : false;
            });
            this.setState({ admins: temp });
          } else {
            this.setState({ admins: this.props.workersUsers.admins });
          }
        });
      }}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <Header
          placement="center"
          backgroundColor="white"
          leftComponent={{
            icon: this.state.headerLeftIcon,
            onPress: this.headerLeftAction
          }}
          centerComponent={{
            text: "Admins",
            style: { color: "#000", fontSize: 16 }
          }}
          rightComponent={{
            icon: this.state.headerRightIcon,
            onPress: this.headerRightAction
          }}
          containerStyle={styles.headerContainerStyle}
          statusBarProps={styles.statusBarProps}
        />

        <FlatList
          keyExtractor={item => item.uid.toString()}
          data={this.state.admins}
          extraData={this.state.admins}
          renderItem={this.renderItem}
          style={{ margin: 8, backgroundColor: "rgba(0,0,0,0)" }}
          refreshing={this.state.refresh}
          onRefresh={this.refreshAction}
          ListFooterComponent={this.renderFooter}
          ListHeaderComponent={this.renderSearch}
        />
        <Modal
          animated={true}
          animationType="slide"
          visible={this.state.processModel}
          transparent={true}
        >
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="green" />
          </View>
        </Modal>
      </View>
    );
  }

  listLongPress = item => {
    if (item.su === true) {
      Snackbar.show({
        title: "Super User Can't be deleted",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
        color: "white"
      });
    } else {
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

      item.isSelected = !item.isSelected;
      item.style = item.isSelected
        ? { backgroundColor: "green" }
        : { backgroundColor: "white" };
      const index = this.state.admins.findIndex(res => res.id === item.id);
      this.state.admins[index] = item;
      this.setState({
        admins: this.state.admins
      });

      if (this.state.selectedCount === 0) {
        this.setState({ headerLeftIcon: menu, headerRightIcon: edit });
      } else {
        this.setState({ headerLeftIcon: check, headerRightIcon: del });
      }
    }
  };
  listOnPress = item => {
    if (this.state.headerLeftIcon === menu) {
      this.props.navigation.navigate("User", { User: item });
    } else {
      this.listLongPress(item);
    }
  };

  headerLeftAction = () => {
    if (this.state.headerLeftIcon === menu) {
      this.props.navigation.openDrawer();
    } else {
      if (this.state.selectedCount === this.state.admins.length) {
        this.state.admins.forEach((workser, index) => {
          (workser.isSelected = false),
            (workser.style = { backgroundColor: "white" });
          this.state.admins[index] = workser;
        });
        this.setState({
          admins: this.state.admins,
          headerLeftIcon: menu,
          selectedCount: 0,
          headerRightIcon: edit
        });
      } else {
        this.state.admins.forEach((workser, index) => {
          (workser.isSelected = workser.su ? false : true),
            (workser.style = workser.su
              ? { backgroundColor: "white" }
              : { backgroundColor: "green" });
          this.state.admins[index] = workser;
        });
        this.setState({
          admins: this.state.admins,
          selectedCount: this.state.admins.length,
          headerLeftIcon: check,
          headerRightIcon: del
        });
      }
    }
  };
  headerRightAction = () => {
    if (this.state.headerRightIcon === edit) {
      this.setState({ headerLeftIcon: check, headerRightIcon: del });
    } else {
      this.setState({ processModel: true });
      deleteWorkerAndUser(
        this.props,
        this.state.admins,
        this.hideActivityIndicator
      );
      this.setState({ headerLeftIcon: menu, headerRightIcon: edit });
    }
  };

  hideActivityIndicator = () => {
    this.setState({ processModel: false });
  };

  refreshAction = () => {
    this.setState({ refresh: true }, () => {
      getAllUsers(this.props, this.hideFooterLoading);
    });
    this.setState({ refresh: false });
  };

  hideFooterLoading = () => {
    this.setState({
      footerLoading: false
    });
  };

  renderFooter = () => {
    if (!this.state.footerLoading) return null;

    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };
}

const mapStateToProps = state => {
  return {
    workersUsers: state.workersUsers,
    overlays: state.overlays
  };
};

export default connect(mapStateToProps)(AdminScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)"
  },
  headerContainerStyle: {
    elevation: 5
  },
  statusBarProps: {
    backgroundColor: "rgba(0,0,0,0)"
  },
  flatList: {
    margin: 8
    // backgroundColor: "rgba(0,0,0,0)"
  },
  listItemContainerStyle: {
    borderRadius: 4,
    marginBottom: 1,
    elevation: 1
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
