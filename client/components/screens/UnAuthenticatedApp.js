import React, { Component } from "react";
import { Image, Button, StyleSheet, Text, View, Alert } from 'react-native';

import { AUTH0_DOMAIN, AUTH0_CLIENT_ID} from 'react-native-dotenv'
import Amplify from 'aws-amplify'
import awsmobile from '../../aws-exports.js'

Amplify.configure(awsmobile)

import { Auth } from 'aws-amplify'

export default class UnAuthenticatedApp extends Component {
  state = {
    userInfo: null,
    isLoggedIn: false,
    name: null
  };


  async logOut() {
    try {
      await Auth.signOut()
    } catch (error) {
      console.log(error);
    }
  }

  async displayUser() {
    const user = await Auth.currentAuthenticatedUser().catch(err => console.log(err));
    console.log(user);
  }
  

  render() {
    const { name } = this.state;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Sign in with Google"
          onPress={() => Auth.federatedSignIn({ provider: "Google" })}
        />
        <Button
          title="Sign in with Facebook"
          onPress={() => Auth.federatedSignIn({ provider: "Facebook" })}
        />
        <Button
          title="Launch Hosted UI"
          onPress={() => Auth.federatedSignIn()}
        />

        <Button
         title="log user info"
         onPress={() => this.displayUser()}
        />
        <Button
         title="Log out"
         onPress={() => logOut()}
        />
      </View>
    );
  }

}

export default UnAuthenticatedApp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 26,
    },
    scrollView: {
        backgroundColor: 'pink',
        marginHorizontal: 20,
    },
    text: {
        fontSize: 42,
    },
    reportsHeading: {
        flex: 1,
        paddingTop: 40,
        alignContent: 'center',
        justifyContent: 'space-between',

    }
});
