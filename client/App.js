import React from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { rootStack } from './components/Navigator/navigator';
// import { AppProviders } from "./context";


const sentry = require('./services/sentry');


export default function App() {
  return (
      //   <AppProviders>
            <View style={{flex:1}}>
              <AppContainer />
            </View>
      //   </AppProviders>
  );
}

const AppContainer = createAppContainer(rootStack);