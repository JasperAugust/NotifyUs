import React, { Component } from "react";
import { Image, Button, StyleSheet, Text, View } from 'react-native';
import { AuthSession } from 'expo';

const FB_APP_ID = '435729943774253';

export default class ProfileScreen extends Component {
  state = {
    userInfo: null,
    isLoggedIn: false
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {(!this.state.userInfo || !this.state.isLoggedIn) ? (
          <Button title="Open FB Auth" onPress={this._handlePressAsync} />
        ) : (
          this._renderUserInfo()
        )}
        <Button title="Log out" onPress={this.handleLogOut}/>
      </View>
    );
  }
  handleLogOut = () => {
    this.setState({isLoggedIn: false});
    console.log(this.state.isLoggedIn);
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
    // NB!!!: Please do not actually request the token on the client (see:
    // response_type=token in the authUrl), it is not secure. Request a code
    // instead, and use this flow:
    // https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/#confirm
    // The code here is simplified for the sake of demonstration. If you are
    // just prototyping then you don't need to concern yourself with this and
    // can copy this example, but be aware that this is not safe in production.

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
  };
}