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
  deleteWorkerAndUser,
  getAllUsers
} from "../../../../NewFirebase/Admin/WorkersUsers";

//icon name constant
const menu = "menu";
const check = "check";
const edit = "edit";
const del = "delete";

var unsubscriber;

class UsersScreen extends Component {
  state = {
    headerLeftIcon: menu,
    headerRightIcon: edit,
    refresh: false,
    users: [],
    selectedCount: 0,
    processModel: false,
    footerLoading: true,
    SearchText: null
  };
  componentDidMount() {
    unsubscriber = getAllUsers(this.props, this.hideFooterLoading);
  }
  componentDidUpdate(prevProps) {
    if (this.state.users != this.props.workersUsers.users) {
      this.setState({
        users: this.props.workersUsers.users,
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
            const temp = this.state.users.filter(worker => {
              return (worker.full_name
                .toLowerCase()
                .search(text.toLowerCase()) ||
                worker.gmail.toLowerCase().search(text.toLowerCase())) != -1
                ? true
                : false;
            });
            this.setState({ users: temp });
          } else {
            this.setState({ users: this.props.workersUsers.users });
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
            text: "Users",
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
          data={this.state.users}
          extraData={this.state.users}
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
    const index = this.state.users.findIndex(res => res.uid === item.uid);
    this.state.users[index] = item;
    this.setState({
      users: this.state.users
    });

    if (this.state.selectedCount === 0) {
      this.setState({ headerLeftIcon: menu, headerRightIcon: edit });
    } else {
      this.setState({ headerLeftIcon: check, headerRightIcon: del });
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
      if (this.state.selectedCount === this.state.users.length) {
        this.state.users.forEach((workser, index) => {
          (workser.isSelected = false),
            (workser.style = { backgroundColor: "white" });
          this.state.users[index] = workser;
        });
        this.setState({
          users: this.state.users,
          headerLeftIcon: menu,
          selectedCount: 0,
          headerRightIcon: edit
        });
      } else {
        this.state.users.forEach((workser, index) => {
          (workser.isSelected = true),
            (workser.style = { backgroundColor: "green" });
          this.state.users[index] = workser;
        });
        this.setState({
          users: this.state.users,
          selectedCount: this.state.users.length,
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
        this.state.users,
        this.hideActivityIndicator
      );
      this.setState({ headerLeftIcon: menu, headerRightIcon: edit });
    }
  };

  hideActivityIndicator = () => {
    this.setState({ processModel: false });
  };

  hideFooterLoading = () => {
    this.setState({
      footerLoading: false
    });
  };

  refreshAction = () => {
    this.setState({ refresh: true }, () => {
      getAllUsers(this.props, this.hideFooterLoading);
    });
    this.setState({ refresh: false });
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

export default connect(mapStateToProps)(UsersScreen);

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
