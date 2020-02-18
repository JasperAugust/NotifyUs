import React from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { rootStack } from './components/Navigator/navigator';
// import { AppProviders } from "./context";
import Amplify from 'aws-amplify';
import awsmobile from '../../aws-exports.js';

Amplify.configure(awsmobile);

import { withAuthenticator } from 'aws-amplify';

const sentry = require('./services/sentry');

export default function App() {
  return (
    //   <AppProviders>
    <View style={{ flex: 1 }}>
      <AppContainer />
    </View>
    //   </AppProviders>
  );
}

const AppContainer = createAppContainer(rootStack);
