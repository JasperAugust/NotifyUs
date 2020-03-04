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
        case 'customOAuthState':
          this.setState({ customState: data });
      }
    });

    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user }))
      .catch(() => console.log('Not signed in'));
  }

  // If FB signIn successful, navigates to AuthLoading screen
  loginFacebook = async => {
    Auth.federatedSignIn({ provider: 'Facebook' })
      .then(user => {
        console.log("I'm getting rendered again");
        this.setState({ user });
        console.log('User saved');
        // this.handleNavigation('Authloading');
        console.log('redirected to authloading');
      })
      .catch(err => {
        console.log('We have an error bois and girls.');
        console.log(err);
      });
  };

  // If Google signIn successful, navigates to AuthLoading screen
  loginGoogle = async => {
    Auth.federatedSignIn({ provider: 'Google' })
      .then(user => {
        this.setState({ user });
        // this.handleNavigation('Authloading');
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
        <Button
          title='Sign in with Google'
          onPress={() => this.loginGoogle()}
        />
        <Button
          title='Sign in with Facebook'
          onPress={() => this.loginFacebook()}
        />
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
          <Text style={styles.textStyle}>Forget password ?</Text>
        </TouchableOpacity>
        <Button title='Display user info' onPress={() => this.displayUser()} />
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
    padding: 20,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    color: '#fff',
  },
});
