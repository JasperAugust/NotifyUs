import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';

import { Auth } from 'aws-amplify';
const logo = require('../../assets/logo.png');

export default class WelcomeScreen extends React.Component {
  state = {
    user: null,
    isLoggedIn: false,
    name: null,
  };
  handleRoute = async destination => {
    await this.props.navigation.navigate(destination);
  };

  // If FB signIn successful, navigates to AuthLoading screen
  loginFacebook = async => {
    Auth.federatedSignIn({ provider: 'Facebook' })
      .then(user => {
        this.setState({ user });
        this.handleRoute('Authloading');
      })
      .catch(err => {
        // this.handleRoute('WelcomeScreen');
        console.log(err);
      });
  };

  // If Google signIn successful, navigates to AuthLoading screen
  loginGoogle = async => {
    Auth.federatedSignIn({ provider: 'Google' })
      .then(user => {
        this.setState({ user });
        this.handleRoute('Authloading');
      })
      .catch(err => {
        // this.handleRoute('WelcomeScreen');
        console.log(err);
      });
  };
  async displayUser() {
    const user = await Auth.currentAuthenticatedUser().catch(err =>
      console.log(err)
    );
    console.log(user);
  }
  async signOut() {
    await Auth.signOut();
  }
  render() {
    return (
      <View style={styles.container}>
        <Image source={logo} style={{ width: 110.46, height: 117 }} />
        <Button
          title='Sign in with Google'
          onPress={() => this.loginGoogle()}
        />
        <Button
          title='Sign in with Facebook'
          onPress={() => this.loginFacebook()}
        />
        <Button
          title='Sign in with hosted UI'
          onPress={() => Auth.federatedSignIn()}
        />
        <Button title='Display user info' onPress={() => this.displayUser()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b44666', // #b13366
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    padding: 20,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    color: '#fff',
  },
});
