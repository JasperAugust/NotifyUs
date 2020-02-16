import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform } from 'react-native';

// screens here:
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HistoryScreen from '../screens/HistoryScreen';
import reportModal from '../screens/reportModal';

const Icon = ({ name, size, color }) => (
  <Ionicons
    name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-${name}`}
    size={size}
    color={color}
  />
);

// TODO: Implement switchNavigator to have authentication screen before main screen switcher.
// const AuthNavigator = createSwitchNavigator(
//   {
//     Authentication: {
//       screen: AuthScreen,
//       navigationOptions: ({navigation}) => ({
//         tab
//       })
//     }
//   }
// )c

const MainNavigator = createBottomTabNavigator(
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

export const rootStack = createStackNavigator(
  {
    Home: { screen: MainNavigator },
    Modal: { screen: reportModal },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);
