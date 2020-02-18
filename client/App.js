import React, { Component } from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { rootStack } from './components/Navigator/navigator';
// import { AppProviders } from "./context";
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

import { withAuthenticator } from 'aws-amplify-react-native';

const sentry = require('./services/sentry');

class App extends Component<Props> {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppContainer />
      </View>
    );
  }
}

export default withAuthenticator(App);

const AppContainer = createAppContainer(rootStack);
