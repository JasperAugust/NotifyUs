import React from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { rootStack } from './components/Navigator/navigator';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <AppContainer />
    </View>
  );
}

const AppContainer = createAppContainer(rootStack);


