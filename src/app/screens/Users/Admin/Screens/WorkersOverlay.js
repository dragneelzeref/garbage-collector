import React, { Component } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { ListItem, Button, SearchBar } from "react-native-elements";

import { connect } from "react-redux";

import TouchableScale from "react-native-touchable-scale"; // https://github.com/kohver/react-native-touchable-scale

import {
  getAllUsers,
  unsubscriber
} from "../../../../NewFirebase/Admin/WorkersUsers";

import Icon from "react-native-vector-icons/MaterialIcons";

//icon name constant
const menu = "menu";
const check = "check";
const edit = "edit";
const del = "delete";

class WorkersScreen extends Component {
  state = {
    refresh: false,
    workers: [],
    selectedCount: 0,
    processModel: false,
    footerLoading: true,
    SearchText: null
  };
  componentDidMount() {
    this.setState({
      workers: this.props.workersUsers.workers,
      footerLoading: false
    });
    getAllUsers(this.props, this.hideFooterLoading);
  }
  componentDidUpdate(prevProps) {
    if (this.state.workers != this.props.workersUsers.workers) {
      this.setState({
        workers: this.props.workersUsers.workers,
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
      onPress={() => {
        this.props.addWorker(item);
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
            const temp = this.state.workers.filter(worker => {
              return (worker.full_name
                .toLowerCase()
                .search(text.toLowerCase()) ||
                worker.gmail.toLowerCase().search(text.toLowerCase())) != -1
                ? true
                : false;
            });
            this.setState({ workers: temp });
          } else {
            this.setState({ workers: this.props.workersUsers.workers });
          }
        });
      }}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={item => item.uid.toString()}
          data={this.state.workers}
          extraData={this.state.workers}
          renderItem={this.renderItem}
          style={{ margin: 8, backgroundColor: "rgba(0,0,0,0)" }}
          refreshing={this.state.refresh}
          onRefresh={this.refreshAction}
          ListFooterComponent={this.renderFooter}
          ListHeaderComponent={this.renderSearch}
        />
        <View style={styles.bottomButtons}>
          <Button
            raised
            icon={<Icon name="person" size={20} color="white" />}
            title="Remove"
            buttonStyle={styles.button}
            activeOpacity={0.7}
            onPress={() => {
              this.props.addWorker();
            }}
          />
          <Button
            raised
            icon={<Icon name="delete" size={20} color="white" />}
            title="Route"
            buttonStyle={styles.button}
            activeOpacity={0.7}
            onPress={() => {
              this.props.deleteRoute();
            }}
          />
        </View>
      </View>
    );
  }

  listOnPress = item => {
    alert("worker");
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

export default connect(mapStateToProps)(WorkersScreen);

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
  },
  bottomButtons: {
    flexDirection: "row",
    padding: 8,
    justifyContent: "space-between"
  },
  button: {
    backgroundColor: "red"
  }
});
