import { BottomTabBarOptions, BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomNavigation, BottomNavigationTab, Layout } from '@ui-kitten/components';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddOrderScreen from './screens/AddOrderScreen';
import AddUserScreen from './screens/AddUserScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import OrdersScreen from './screens/OrdersScreen';
import SettingsScreen from './screens/SettingsScreen';
import UserScreen from './screens/UserScreen';
import { PersonIcon, RideIcon, SettingsIcon } from './utils/icons';

export type RootParamList = {
  Login: undefined;
  MainMenu: undefined;
  Users: undefined;
  Orders: undefined;
  Settings: undefined;
  Home: undefined;
  AddUser: { userId: number } | undefined;
  User: { userId: number };
  AddOrder: { userId: number };
};

const Stack = createStackNavigator<RootParamList>();
const Tab = createBottomTabNavigator<RootParamList>();

const BottomTabBar = ({ navigation, state }: BottomTabBarProps<BottomTabBarOptions>) => {
  const insets = useSafeAreaInsets();
  return (
    <Layout>
      <BottomNavigation
        style={{ marginBottom: insets.bottom }}
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab icon={PersonIcon} title='Zákazníci' />
        <BottomNavigationTab icon={RideIcon} title='Výjazdy' />
        <BottomNavigationTab icon={SettingsIcon} title='Nastavenia' />
      </BottomNavigation>
    </Layout>
  )
}


const MainMenuNavigator: React.FC = () => {
  return (
    <Tab.Navigator tabBar={props => <BottomTabBar {...props} />}>
      <Tab.Screen name="Users" component={UserNavigator} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

const UserNavigator: React.FC = () => {
  return (
    <Stack.Navigator headerMode='none' >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="User" component={UserScreen} />
      <Stack.Screen name="AddUser" component={AddUserScreen} />
      <Stack.Screen name="AddOrder" component={AddOrderScreen} />
    </Stack.Navigator>
  )
}

const Navigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator mode='modal' headerMode='none' >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainMenu" component={MainMenuNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator
