import { StackScreenProps } from '@react-navigation/stack';
import { Button, Divider, Input, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet } from 'react-native';
import { RootParamList } from '../Navigator';
import { CloseIcon } from '../utils/icons';
import * as Store from '../database/store'
import { ISettings } from '../types';
import { v4 as uuidv4 } from 'uuid';

type Props = StackScreenProps<RootParamList, 'ChangePin'>;

const ChangePinScreen: React.FC<Props> = ({ navigation }) => {

  const [pin, setPin] = useState("")

  const validateAndSave = async () => {
    if (pin.length < 4) {
      Alert.alert('Chyba', 'PIN kód musí mať minimálne 4 čísla')
      return;
    }
    try {
      const oldSettings = await Store.loadSettings()
      const res: ISettings = {
        id: uuidv4(),
        pin: parseInt(pin),
        darkMode: oldSettings?.darkMode || false
      }

      await Store.storeSettings(res)
      Alert.alert('PIN zmenený', 'Váš PIN bol úspešne zmenený', [{ text: 'OK', onPress: () => navigation.pop() }])
    } catch (err) {
      Alert.alert('Chyba', 'Pin sa z nejakej príčiny nepodarilo zmeniť')
    }

  }

  return (
    <Layout style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <TopNavigation
            title='Zmena kódu PIN'
            alignment='center'
            accessoryLeft={() => {
              return <TopNavigationAction onPress={() => navigation.pop()} icon={CloseIcon} />
            }} />
          <Divider />
          <Layout level='2' style={{ flex: 1, padding: 32, justifyContent: 'center' }}>

            <Input
              placeholder='Zadajte nový PIN kód'
              value={pin}
              autoFocus={true}
              textStyle={{ textAlign: 'center' }}
              keyboardType='numeric'
              secureTextEntry={true}
              style={{ marginBottom: 8 }}
              onChangeText={nextValue => setPin(nextValue)}
            />
            <Button onPress={validateAndSave}>Zmeniť</Button>
          </Layout>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Layout>
  );
}
export default ChangePinScreen

const styles = StyleSheet.create({

});