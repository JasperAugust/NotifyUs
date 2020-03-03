import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import { Auth } from 'aws-amplify';

export default class AuthLoadingScreen extends React.Component {
  state = {
    userToken: null,
  };
  async componentDidMount() {
    console.log('O man');
    await this.loadApp();
    console.log('shit');
    this.props.navigation.navigate(this.state.userToken ? 'App' : 'Auth');
  }
  // Get the logged in users (their JWT) and remember them
  loadApp = async () => {
    await Auth.currentAuthenticatedUser()
      .then(user => {
        console.log(user);
        this.setState({
          userToken: user.signInUserSession.accessToken.jwtToken,
        });
      })
      .catch(err => console.log(err));
  };
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#fff' />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#32CD32',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
