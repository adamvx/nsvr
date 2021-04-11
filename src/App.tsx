import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import "reflect-metadata";
import { Connection } from 'typeorm';
import { makeDatabaseConnection } from './database';
import Settings from './database/Settings';
import { initFirebase } from './firebase';
import Navigator from './Navigator';

function App() {

  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState<Connection>()

  useEffect(() => {
    console.log('EFFFFEFEFEFEFFCSCT')


    makeDatabaseConnection().then(async connection => {
      setConnection(connection)
      try {
        const res = await Settings.find({});
        if (res.length === 0) {
          const settings = new Settings();
          settings.pin = 1111;
          await settings.save()
        }
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    });
    () => connection?.close()
  }, [])

  if (loading) {
    return <View />
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <StatusBar style={'auto'} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <Navigator />
      </ApplicationProvider>
    </>
  );
}

export default App;
