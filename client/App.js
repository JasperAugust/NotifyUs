import React, { Component } from 'react';
import { View } from 'react-native';
import { registerRootComponent } from 'expo';

import { createAppContainer } from 'react-navigation';
import { MainNav } from './components/Navigator/Navigator';

import Amplify, { Auth } from 'aws-amplify';
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
const AppContainer = createAppContainer(MainNav);
