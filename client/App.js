import React, { Component } from 'react';
import { View, Font } from 'react-native';
import { registerRootComponent } from 'expo';

import { createAppContainer } from 'react-navigation';
import { MainNav, topNavigator } from './components/Navigator/Navigator';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const sentry = require('./services/sentry');

export default class App extends Component<Props> {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppContainer />
      </View>
    );
  }
}
const AppContainer = createAppContainer(topNavigator);
