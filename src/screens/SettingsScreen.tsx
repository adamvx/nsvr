import { StackScreenProps } from '@react-navigation/stack';
import { Divider, Icon, Layout, Text, TopNavigation } from '@ui-kitten/components';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Switch, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Order from '../database/Order';
import Settings, { findLatest } from '../database/Settings';
import User from '../database/User';
import { downloadDataFirebase, uploadDataFirebase } from '../firebase';
import { mapUserToBackup } from '../firebase/backup';
import { NoBackupInFirebaseError, NoDataToSyncError } from '../firebase/errors';
import { RootParamList } from '../Navigator';
import { EEvnentType, ISettings } from '../types';
import * as Events from '../utils/events';

type Props = StackScreenProps<RootParamList, 'Settings'>;

interface ISettingItem {
  id: number;
  icon: string;
  title: string;
}

const data: ISettingItem[] = [
  { id: 0, icon: 'unlock-outline', title: 'Zmeniť PIN kódu' },
  { id: 1, icon: 'cloud-upload-outline', title: 'Zálohovať dáta' },
  { id: 2, icon: 'download-outline', title: 'Obnoviť dáta zo zálohy' },
  { id: 3, icon: 'moon-outline', title: 'Tmavý motív' },
]

const SettingsScreen: React.FC<Props> = ({ navigation }) => {

  const [loadingIds, setLoadingIds] = useState<number[]>([])
  const [settings, setSettings] = useState<ISettings>()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    findLatest().then(settings => {
      setSettings(settings)
    }).catch(console.error)
  }

  const changePin = () => {
    navigation.navigate('ChangePin')
  }

  const onDarkModeToggle = async (val: boolean) => {
    const res = new Settings()
    res.pin = settings?.pin || 1111
    res.darkMode = val
    await res.save();
    Events.publish(EEvnentType.DarkMode, null)
    loadSettings()
  }

  const uploadData = async (id: number) => {
    if (loadingIds.includes(id)) {
      return
    }
    setLoadingIds([...loadingIds, id])
    try {
      const users = await User.find({ relations: ["orders"] })
      if (users.length === 0) throw new NoDataToSyncError()
      const backup = mapUserToBackup(users)
      await uploadDataFirebase(backup)
      Alert.alert('Záloha dokončená', 'Záloha prebehla úspešne')
    } catch (err) {
      let message = 'Skontrolujte či máte prístup na internet a skúste znovu';
      if (err instanceof NoDataToSyncError) {
        message = 'Nemáte žiadne údaje na synchronizáciu. Vytvorte si záznamy a potom synchronizujte.'
      }
      Alert.alert('Záloha neuspešná', message)
    } finally {
      setLoadingIds([...loadingIds].filter(x => x === id))
    }

  }

  const downloadData = async (id: number) => {
    if (loadingIds.includes(id)) {
      return
    }
    setLoadingIds([...loadingIds, id])
    try {
      const result = await downloadDataFirebase()

      await User.delete({})
      await Order.delete({})

      for (const backupUser of result.users) {
        const user = new User()
        user.firstName = backupUser.firstName;
        user.lastName = backupUser.lastName;
        user.phoneNumber = backupUser.phoneNumber;
        user.city = backupUser.city;
        user.postCode = backupUser.postCode;
        user.address = backupUser.address;
        try {
          await user.save()
        } catch (err) {
          Alert.alert('User', JSON.stringify(backupUser))
          Alert.alert('Err', err.name + " " + err.message + " " + err.stack)
        }

        for (const backupOrder of backupUser.orders) {
          const order = new Order()
          order.volume = backupOrder.volume
          order.price = backupOrder.price
          order.ticketId = backupOrder.ticketId
          order.date = backupOrder.date
          order.note = backupOrder.note
          order.user = user
          await order.save();
        }
      }
      Alert.alert('Obnova dokončená', 'Obnova zo zálohy prebehla úspešne')
    } catch (err) {
      let message = 'Skontrolujte či máte prístup na internet a skúste znovu';
      if (err instanceof NoBackupInFirebaseError) {
        message = 'Žiadna záloha nieje dopstupná na stiahnutie.'
      }
      Alert.alert('Obnova neúspešná', message)
    } finally {
      setLoadingIds([...loadingIds].filter(x => x === id))
    }
  }

  const onItemPress = (id: number) => {
    switch (id) {
      case 0: {
        changePin()
        break;
      }
      case 1: {
        uploadData(id)
        break;
      }
      case 2: {
        Alert.alert(
          "Potvrdenie obnovy",
          "Obnova dát nahradí všetky vaše dáta uložené v telefóne poslednou dostupnou zálohou",
          [
            {
              text: "Zrušiť",
              style: "cancel"
            },
            {
              text: "Potvrdiť",
              onPress: () => downloadData(2)
            }
          ]
        );

        break;
      }
    }
  }

  const renderSettingsSwitchItem = (item: ISettingItem) => {
    return (
      <View >
        <Layout style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={item.icon} style={{ width: 24, height: 24, tintColor: 'gray', marginRight: 24 }} />
          <Text style={{ flex: 1 }}>{item.title}</Text>
          <Switch value={settings?.darkMode || false} onValueChange={onDarkModeToggle} />
        </Layout>
        <Divider />
      </View>
    )
  }

  const renderSettingsItem = (item: ISettingItem) => {
    return (
      <TouchableOpacity onPress={() => onItemPress(item.id)}>
        <Layout style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={item.icon} style={{ width: 24, height: 24, tintColor: 'gray', marginRight: 24 }} />
          <Text style={{ flex: 1 }}>{item.title}</Text>
          <ActivityIndicator size='small' color='gray' animating={loadingIds.includes(item.id)} />
        </Layout>
      </TouchableOpacity>
    )
  }

  const renderAppInfo = () => {
    return (
      <Layout level='2' style={{ padding: 16, alignItems: 'center' }}>
        <Text appearance='hint' category='s1' style={{ marginBottom: 4 }}>{'Aplikácia NSVR'}</Text>
        <Text appearance='hint'>{'Verzia: ' + Constants.manifest.version}</Text>
      </Layout>
    )
  }

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title='Nastavenia' alignment='center' />
        <Divider />
        <Layout level='2' style={{ flex: 1 }}>
          <ScrollView>
            <Layout level='2'>
              <Text category='s1' style={{ padding: 16 }}>Všeobecné nastavenia</Text>
              <Divider />
              {renderSettingsItem(data[0])}
              <Divider />
              {renderSettingsItem(data[1])}
              <Divider />
              {renderSettingsItem(data[2])}
              <Divider />
              <Text category='s1' style={{ padding: 16 }}>Doplnkové nastavenia</Text>
              <Divider />
              {renderSettingsSwitchItem(data[3])}
              <Divider />
              {renderAppInfo()}
            </Layout>
          </ScrollView>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
}
export default SettingsScreen

const styles = StyleSheet.create({

});