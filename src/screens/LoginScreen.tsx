import { StackScreenProps } from '@react-navigation/stack';
import { Button, Divider, Icon, Input, Layout, TopNavigation } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { Alert, AppState, AppStateEvent, AppStateStatus, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import * as Settings from '../database/Settings';
import { RootParamList } from '../Navigator';


type Props = StackScreenProps<RootParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {

  const [pin, setPin] = useState<string>('')

  useEffect(() => {
    AppState.addEventListener('change', stateChange);
    () => AppState.removeEventListener('change', stateChange)
  }, [])

  const stateChange = (state: AppStateStatus) => {
    console.log(state)
    state === 'background' && navigation.popToTop()
  }

  const login = async () => {
    const settings = await Settings.findLatest()
    if (parseInt(pin) === settings?.pin) {
      navigation.navigate('MainMenu');
    } else {
      Alert.alert('Chyba', 'Zadali ste zlý PIN kód.')
    }
    setPin('');
  }

  return (
    <Layout style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <TopNavigation title='Prihlásenie' alignment='center' />
          <Divider />
          <Layout style={{ flex: 1, padding: 32 }}>
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
              <Icon name='archive-outline' fill='#8F9BB3' style={{ width: 48, height: 48 }} />
            </View>
            <View style={{ flex: 3, justifyContent: 'center' }}>
              <Input
                placeholder='Zadajte pin kód'
                value={pin}
                autoFocus={true}
                textStyle={{ textAlign: 'center' }}
                keyboardType='numeric'
                secureTextEntry={true}
                style={{ marginBottom: 8 }}
                onChangeText={nextValue => setPin(nextValue)}
              />
              <Button onPress={login}>Vstúpiť</Button>
            </View>
          </Layout>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Layout>
  );
}
export default LoginScreen

const styles = StyleSheet.create({

});