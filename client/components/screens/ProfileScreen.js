import React, { Component } from 'react';
import {
  Image,
  Button,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Auth } from 'aws-amplify';

export default class ProfileScreen extends Component {
  state = {
    userInfo: null,
    isLoggedIn: false,
    name: null,
  };

  async displayUser() {
    const user = await Auth.currentAuthenticatedUser().catch(err =>
      console.log(err)
    );
    this.setState({ userInfo: user });
  }
  async signOut() {
    await Auth.signOut();
  }

  // Sign out from the app alert
  signOutAlert = async () => {
    await Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from the app?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Canceled'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.signOut() },
      ],
      { cancelable: false }
    );
  };

  // Sign out from the app
  signOut = async () => {
    await Auth.signOut()
      .then(() => {
        console.log('Sign out complete');
        this.props.navigation.navigate('Authloading');
      })
      .catch(err => console.log('Error while signing out!', err));
  };

  render() {
    const { name, userInfo } = this.state;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title='log user info' onPress={() => this.displayUser()} />

        <TouchableOpacity
          style={[
            styles.buttonStyle,
            { flexDirection: 'row', justifyContent: 'center' },
          ]}
          onPress={this.signOutAlert}
        >
          <Ionicons
            name='md-power'
            style={{ color: '#000', marginRight: 10, fontSize: 30 }}
          />
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
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
