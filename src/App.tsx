import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import "reflect-metadata";
import Navigator from './Navigator';
import { EEvnentType } from './types';
import * as Events from './utils/events';
import 'moment/locale/sk'
import * as Store from './database/store'

function App() {

  const [loading, setLoading] = useState(true);
  const [isDarkMode, setDarkMode] = useState<boolean>(false)

  useEffect(() => {
    moment.locale('sk')
    Events.subscribe(EEvnentType.DarkMode, loadSettings)
    loadSettings().then(() => {
      setLoading(false)
    }).catch(console.error)
  }, [])

  const loadSettings = async () => {
    try {
      const res = await Store.loadSettings()
      setDarkMode(res.darkMode)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <View />
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <ApplicationProvider {...eva} theme={isDarkMode ? eva.dark : eva.light}>
        <Layout style={{ height: Constants.statusBarHeight }} />
        <Navigator />
      </ApplicationProvider>
    </>
  );
}

export default App;
