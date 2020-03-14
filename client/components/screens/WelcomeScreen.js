import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';

import { Auth, Hub } from 'aws-amplify';
const logo = require('../../assets/logo.png');

export default class WelcomeScreen extends React.Component {
  state = {
    user: null,
    isLoggedIn: false,
    name: null,
  };
  handleNavigation = async destination => {
    await this.props.navigation.navigate(destination);
  };

  componentDidMount() {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          this.setState({ user: data });
          this.handleNavigation('Authloading');
          break;
        case 'signOut':
          this.setState({ user: null });
          break;
      }
    });

    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user }))
      .catch(() => console.log('Not signed in'));
  }

  componentWillUnmount() {
    Hub.remove('auth');
  }

  // If FB signIn successful, navigates to AuthLoading screen
  loginFacebook = async => {
    Auth.federatedSignIn({ provider: 'Facebook' })
      .then(user => {
        this.setState({ user });
      })
      .catch(err => {
        console.log(err);
      });
  };

  // If Google signIn successful, navigates to AuthLoading screen
  loginGoogle = async => {
    Auth.federatedSignIn({ provider: 'Google' })
      .then(user => {
        this.setState({ user });
      })
      .catch(err => {
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
        <TouchableOpacity
          onPress={() => this.loginGoogle()}
          style={styles.buttonStyle}
        >
          <Text style={styles.textStyle}>Log in with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.loginFacebook()}
          style={styles.buttonStyle}
        >
          <Text style={styles.textStyle}>Log in with Facebook</Text>
        </TouchableOpacity>
        <View style={styles.boxContainer}>
          <TouchableOpacity
            onPress={() => this.handleNavigation('SignIn')}
            style={styles.buttonStyle}
          >
            <Text style={styles.textStyle}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.handleNavigation('SignUp')}
            style={styles.buttonStyle}
          >
            <Text style={styles.textStyle}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.handleNavigation('ForgetPassword')}
            style={styles.buttonStyle}
          >
            <Text style={styles.textStyle}>Forgot password ?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#32CD32', // #b13366
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    padding: 5,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 5,
    color: '#fff',
  },
  boxContainer: {
    alignItems: 'center',
    // padding: 30,
  },
});
