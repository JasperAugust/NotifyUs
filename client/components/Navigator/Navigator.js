import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform } from 'react-native';

// screens here:
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HistoryScreen from '../screens/HistoryScreen';
import reportModal from '../screens/reportModal';

import WelcomeScreen from '../screens/WelcomeScreen';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';

const Icon = ({ name, size, color }) => (
  <Ionicons
    name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-${name}`}
    size={size}
    color={color}
  />
);

const appNavigator = createBottomTabNavigator(
  {
    Map: {
      screen: MapScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: () => <Icon name={'map'} size={25} color={'grey'} />,
      }),
    },
    History: {
      screen: HistoryScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: () => <Icon name={'journal'} size={25} color={'grey'} />,
      }),
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: () => <Icon name={'contact'} size={25} color={'grey'} />,
      }),
    },
  },
  {
    initialRouteName: 'Map',
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'MapScreen') {
          iconName = `map`;
        } else if (routeName === 'History') {
          iconName = 'journal';
        } else if (routeName === 'Profile') {
          iconName = `contact`;
        }

        return <Ionicons name={iconName} size={25} color={'tomato'} />;
      },
    }),
  }
);

// Main App navigation
const MainNav = createStackNavigator(
  {
    Home: { screen: appNavigator },
    Modal: { screen: reportModal },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);
const topNavigator = createSwitchNavigator({
  Authloading: { screen: AuthLoadingScreen },
  Auth: { screen: WelcomeScreen },
  App: MainNav,
});

export default topNavigator;
