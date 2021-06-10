import { BottomTabBarOptions, BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomNavigation, BottomNavigationTab, Layout } from '@ui-kitten/components';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddOrderScreen from './screens/AddOrderScreen';
import AddUserScreen from './screens/AddUserScreen';
import ChangePinScreen from './screens/ChangePinScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import OrdersScreen from './screens/OrdersScreen';
import SettingsScreen from './screens/SettingsScreen';
import UserScreen from './screens/UserScreen';
import { PersonIcon, RideIcon, SettingsIcon } from './utils/icons';
import { useKeyboard } from './utils/useKeyboard';

export type RootParamList = {
  Login: undefined;
  MainMenu: undefined;
  Users: undefined;
  Orders: undefined;
  Settings: undefined;
  Home: undefined;
  ChangePin: undefined;
  AddUser: { userId: string } | undefined;
  User: { userId: string };
  AddOrder: { userId: string };
};

const Stack = createStackNavigator<RootParamList>();
const Tab = createBottomTabNavigator<RootParamList>();

const BottomTabBar = ({ navigation, state }: BottomTabBarProps<BottomTabBarOptions>) => {
  const insets = useSafeAreaInsets();
  const shown = useKeyboard();
  if (shown) {
    return <View></View>
  }
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

const Navigator: React.FC = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator mode='modal' headerMode='none' >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainMenu" component={MainMenuNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const MainMenuNavigator: React.FC = () => {
  return (
    <Tab.Navigator tabBar={props => <BottomTabBar {...props} />}>
      <Tab.Screen name="Users" component={UserNavigator} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Settings" component={SettingsNavigator} />
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

const SettingsNavigator: React.FC = () => {
  return (
    <Stack.Navigator mode='modal' headerMode='none' >
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ChangePin" component={ChangePinScreen} />
    </Stack.Navigator>
  )
}

export default Navigator
