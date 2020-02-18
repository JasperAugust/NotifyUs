import React, { Component } from 'react';
import { Image, Button, StyleSheet, Text, View, Alert } from 'react-native';

import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from 'react-native-dotenv';

import { Auth } from 'aws-amplify';

export default class ProfileScreen extends Component {
  state = {
    userInfo: null,
    isLoggedIn: false,
    name: null,
  };

  async logOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log(error);
    }
  }

  async displayUser() {
    const user = await Auth.currentAuthenticatedUser().catch(err =>
      console.log(err)
    );
    console.log(user);
  }

  render() {
    const { name, userInfo } = this.state;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View>
          {name ? (
            <Text style={styles.title}>You are logged in, {name}!</Text>
          ) : (
            <Button title='Log in with Auth0' onPress={this.login} />
          )}
        </View>
        <Button
          title='Sign in with Google'
          onPress={() => Auth.federatedSignIn({ provider: 'Google' })}
        />
        <Button
          title='Sign in with Facebook'
          onPress={() => Auth.federatedSignIn({ provider: 'Facebook' })}
        />

        <Button title='Log out' onPress={async () => await Auth.signOut()} />

        <Button title='log user info' onPress={() => this.displayUser()} />
      </View>
    );
  }
}

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
    // flexDirection: 'row',
    flex: 1,
    paddingTop: 40,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
});
