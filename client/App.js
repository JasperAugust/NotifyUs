import React from 'react';
import { View,AsyncStorage } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { rootStack } from './components/Navigator/navigator';
import { Provider } from 'react-redux';

import store from './components/redux/store';

const sentry = require('./services/sentry');




export default function App() {
  return (
        <View style={{ flex: 1 }}>
            <Provider store= {store}>
              <AppContainer />
            </Provider>
        </View>
  );
}

const AppContainer = createAppContainer(rootStack);