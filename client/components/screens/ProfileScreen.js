import React, { Component } from "react";
import { Image, Button, StyleSheet, Text, View, Alert } from 'react-native';
import { AuthSession } from 'expo';
import jwtDecode from 'jwt-decode';

import { AUTH0_DOMAIN, AUTH0_CLIENT_ID} from 'react-native-dotenv'


/**
 * Converts an object to a query string.
 */
function toQueryString(params) {
  return '?' + Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

export default class ProfileScreen extends Component {
  state = {
    userInfo: null,
    isLoggedIn: false,
    name: null
  };

  login = async () => {
    // Retrieve the redirect URL, add this to the callback URL list
    // of your Auth0 application.
    const redirectUrl = AuthSession.getRedirectUrl();
    console.log(`Redirect URL: ${redirectUrl}`);
    
    // Structure the auth parameters and URL
    const queryParams = toQueryString({
      client_id: AUTH0_CLIENT_ID,
      redirect_uri: redirectUrl,
      response_type: 'id_token', // id_token will return a JWT token
      scope: 'openid profile', // retrieve the user's profile
      nonce: 'nonce', // ideally, this will be a random value
    });
    const authUrl = `${AUTH0_DOMAIN}/authorize` + queryParams;

    // Perform the authentication
    const response = await AuthSession.startAsync({ authUrl });
    console.log('Authentication response', response);

    if (response.type === 'success') {
      this.handleResponse(response.params);
    }
  };

  handleResponse = (response) => {
    if (response.error) {
      Alert('Authentication error', response.error_description || 'something went wrong');
      return;
    }

    // Retrieve the JWT token and decode it
    const jwtToken = response.id_token;
    const decoded = jwtDecode(jwtToken);
    console.log(jwtToken);
    console.log(decoded);

    const { name } = decoded;
    this.setState({ name });
  };

  logOut = () => {
    try {
      AuthSession.dismiss();
      this.setState({isLoggedIn:false});
      console.log("Logged out");
    } catch (error) {
      console.log("Error signing out:", error);
    }
    
    
  }

  render() {
    const { name } = this.state;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View>
        {
          (name) ?
          <Text style={styles.title}>You are logged in, {name}!</Text> :
          <Button title="Log in with Auth0" onPress={this.login} />
        }
      </View>
        {(!this.state.userInfo || !this.state.isLoggedIn) ? (
          <Button title="Open FB Auth" onPress={this._loginWithAuth0} />
        ) : (
          this._renderUserInfo()
        )}
        <Button title="Log out" onPress={this.logOut}/>
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

    }
});
