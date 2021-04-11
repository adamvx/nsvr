import { StackScreenProps } from '@react-navigation/stack';
import { Button, Card, Divider, Icon, Layout, List, Modal, Text, TopNavigation } from '@ui-kitten/components';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Order from '../database/Order';
import Settings from '../database/Settings';
import User from '../database/User';
import { downloadDataFirebase, uploadDataFirebase } from '../firebase';
import { mapUserToBackup } from '../firebase/backup';
import { RootParamList } from '../Navigator';
import { IBackup } from '../types';
import Constants from 'expo-constants';

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
]

const SettingsScreen: React.FC<Props> = ({ navigation }) => {

  const [loadingIds, setLoadingIds] = useState<number[]>([])

  const changePin = () => {
    Alert.prompt(
      "Zadajte PIN",
      "Zadajte nový 4 miestny PIN kód",
      [
        {
          text: "Zrušiť",
          style: "cancel"
        },
        {
          text: "Potvrdiť",
          onPress: validateAndSavePin
        }
      ],
      'secure-text',
      undefined,
      'numeric'
    );
  }

  const validateAndSavePin = async (pin: string | undefined) => {
    if (!pin || pin.length !== 4) {
      Alert.alert('Chyba', 'Zadali ste zlý PIN kód')
      return;
    }
    const res = new Settings()
    res.pin = parseInt(pin)
    await res.save();
    Alert.alert('PIN zmenený', 'Váš PIN bol úspešne zmenený')
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
        user.lastName = backupUser.lastName
        user.phoneNumber = backupUser.phoneNumber
        user.city = backupUser.city
        user.postCode = backupUser.postCode
        user.address = backupUser.address
        await user.save()

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

  const renderSettingsItem = (item: ISettingItem) => {
    return (
      <TouchableOpacity onPress={() => onItemPress(item.id)}>
        <Layout style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={item.icon} style={{ width: 24, height: 24, tintColor: 'gray', marginRight: 24 }} />
          <Text style={{ flex: 1 }}>{item.title}</Text>
          <ActivityIndicator animating={loadingIds.includes(item.id)} />
        </Layout>
        <Divider />
      </TouchableOpacity>
    )
  }

  const renderAppInfo = () => {
    return (
      <Layout level='2' style={{ padding: 16, alignItems: 'center' }}>
        <Text appearance='hint' category='s1' style={{ marginBottom: 4 }}>{'NVSR'}</Text>
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
              {renderSettingsItem(data[0])}
              {renderSettingsItem(data[1])}
              {renderSettingsItem(data[2])}
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