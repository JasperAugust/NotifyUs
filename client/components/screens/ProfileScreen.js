import React, { Component } from "react";
import { Image, Button, StyleSheet, Text, View } from 'react-native';
import { AuthSession } from 'expo';

import { actionCreators } from '../redux/actions'
import store from "../redux/store";


const FB_APP_ID = '435729943774253';

export default class ProfileScreen extends Component {
  state = {
    userInfo: null,
    isLoggedIn: false
  };

  componentWillMount() {
    const {store} = this.props

    const {storeState} = store.getState()
    this.setState({storeState.userInfo, storeState.isLoggedIn})

    this.unsubscribe = store.subscribe(() => {
      const {userInfo,isLoggedIn} = store.getState()
      this.setState({userInfo,isLoggedIn})
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  onLogIn = (userInfo) => {
    const {store} = this.props

    store.dispatch(actionCreators.logIn(userInfo))
  }

  onLogOut = () => {
    const {store} = this.props
    console.log(this.state.isLoggedIn);
    store.dispatch(actionCreators.logOut())
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {(!this.state.userInfo || !this.state.isLoggedIn) ? (
          <Button title="Open FB Auth" onPress={this._handlePressAsync} />
        ) : (
          this._renderUserInfo()
        )}
        <Button title="Log out" onPress={this.onLogOut}/>
      </View>
    );
  }
  handleLogOut = () => {
    this.setState({isLoggedIn: false});
  }

  placeSubmitHandler = () => {
    console.log("Submitted");	
  }

  

  _renderUserInfo = () => {
    
    return (
      (!this.state.isLoggedIn) ? ( null) :(
      <View style={{ alignItems: 'center' }}>
        <Image
          source={{ uri: this.state.userInfo.picture.data.url }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text style={{ fontSize: 20 }}>{this.state.userInfo.name}</Text>
        <Text>ID: {this.state.userInfo.id}</Text>
      </View>)
    );
  };

  

  _handlePressAsync = async () => {
    let redirectUrl = AuthSession.getRedirectUrl();
    console.log({
      redirectUrl
    });
    //
    // NB!!!: NOT SAFE FOR PRODUCTION Request code
    // instead, and use this flow:
    // https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/#confirm
  

    let result = await AuthSession.startAsync({
      authUrl:
        `https://www.facebook.com/v2.8/dialog/oauth?response_type=token` +
        `&client_id=${FB_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
    });

    if (result.type !== 'success') {
      alert('Uh oh, something went wrong');
      return;
    }

    let accessToken = result.params.access_token;
    let userInfoResponse = await fetch(
      `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,picture.type(large)`
    );
    const userInfo = await userInfoResponse.json();
    this.setState({ userInfo, isLoggedIn: true });
    onLogIn(userInfo);
  };
}