import React from 'react';
import { View,AsyncStorage } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { rootStack } from './components/Navigator/navigator';


const sentry = require('./services/sentry');


export default function App() {
  return (
        <View style={{ flex: 1 }}>
              <AppContainer />
        </View>
  );
}

const AppContainer = createAppContainer(rootStack);