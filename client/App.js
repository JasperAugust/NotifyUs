import React, { Component } from 'react';
import { View } from 'react-native';
import { registerRootComponent } from 'expo';

import { createAppContainer } from 'react-navigation';
import { topNavigator } from './components/Navigator/Navigator';

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const sentry = require('./services/sentry');

const AppContainer = createAppContainer(topNavigator);

export default class App extends Component<Props> {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppContainer />
      </View>
    );
  }
}
