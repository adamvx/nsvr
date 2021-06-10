import { useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { Button, Card, Divider, Layout, List, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { parsePhoneNumber } from 'libphonenumber-js';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Store from '../database/store';
import { RootParamList } from '../Navigator';
import { IOrder, IUser } from '../types';
import { AddIcon, BackIcon, CallIcon, DeleteIcon, EditIcon, UserIcon } from '../utils/icons';

type Props = StackScreenProps<RootParamList, 'User'>;

const UserSecreen: React.FC<Props> = ({ navigation, route }) => {
  const userId = route.params.userId;
  const [user, setUser] = useState<IUser>()

  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    reloadData()
  }, [isFocused, userId])

  const reloadData = () => {
    Store.findUser(userId).then(user => setUser(user)).catch(err => console.log(err))
  }

  const callPerson = () => {
    Linking.openURL(`tel:${user?.phoneNumber}`).catch(err => {
      console.log(err)
      Alert.alert('Vyskytla sa chyba', 'Telefónne číslo sa nepodarilo vytočiť. Skúste overiť či je správne.')
    })
  }

  const createOrder = () => {
    navigation.navigate('AddOrder', { userId })
  }

  const formatNumber = (number?: string) => {
    if (!number) return '';
    try {
      return parsePhoneNumber(number, 'SK').formatNational()
    } catch (err) {
      return number
    }
  }

  const deleteUser = () => {
    Alert.alert(
      'Naozaj chcete vymazať tohoto požívatela?',
      'Vymažete spolu s ním aj všetky jeho záznamy. Táto operácia je nenávratná!',
      [
        {
          text: 'Áno', style: 'destructive', onPress: async () => {
            try {
              await Store.deleteUser(userId);
              navigation.pop()
            } catch (err) {
              Alert.alert('Vyskytla sa chyba', 'Z nejakého dôvodu sa nepodaril požívateľ vymazať')
            }

          }
        },
        { text: 'Nie' }
      ])
  }

  const onDeleteOrder = (id: string) => {
    Alert.alert(
      'Potvrdenie vymazania',
      'Naozaj chcete tento záznam vymazať? Táto operácia je nenávratná',
      [
        {
          text: 'Áno', style: 'destructive', onPress: () => {
            Store.deleteOrder(id)
              .then(() => reloadData())
              .catch(() => Alert.alert('Vyskytla sa chyba', 'Z nejakého dôvodu sa nepodaril záznam vymazať'))
          }
        },
        { text: 'Nie' }
      ])
  }

  const editUser = () => {
    navigation.navigate('AddUser', { userId: userId })
  }

  const renderContent = () => {
    if (!user) {
      return (
        <Layout level='2' style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='small' color='gray' animating={true} />
        </Layout>
      )
    } else {
      return (
        <List
          style={{ flex: 1 }}
          data={user?.orders}
          contentContainerStyle={{ paddingBottom: insets.bottom, flexGrow: 1 }}
          ListHeaderComponent={() => {
            return (
              <Layout level='2' style={{ padding: 16, alignItems: 'center' }}>
                <View style={{ backgroundColor: 'gray', borderRadius: 32, padding: 16, marginBottom: 8 }}>
                  <UserIcon style={{ width: 64, height: 64, tintColor: 'white' }} />
                </View>
                <Text style={{ marginBottom: 8, textAlign: 'center' }} category='h3'>{`${user?.firstName} ${user?.lastName}`}</Text>
                <Text style={{ marginBottom: 8, textAlign: 'center' }} category='h6'>{`${user?.address}, ${user?.city}, ${user?.postCode}`}</Text>
                <Text style={{ marginBottom: 16, textAlign: 'center' }} category='s2'>{formatNumber(user?.phoneNumber)}</Text>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Button onPress={createOrder} style={{ flex: 1 }} appearance='outline' accessoryLeft={AddIcon}>Pridať výjazd</Button>
                  <Button onPress={callPerson} style={{ flex: 1, marginLeft: 8 }} appearance='outline' accessoryLeft={CallIcon}>Zavolať</Button>
                </View>
              </Layout>
            )
          }}
          ListEmptyComponent={() => {
            return (
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Text category='h6'>Zatiaľ žiadne výjazdy</Text>
                <Button onPress={() => navigation.navigate('AddOrder', { userId })} appearance='ghost'>Pridať výjazd</Button>
              </View>
            )
          }}
          renderItem={({ item }) => {
            const order: IOrder = item
            return (
              <Card
                style={{ flex: 1, marginBottom: 8, borderLeftWidth: 0, borderRightWidth: 0 }}
                header={(props) => {
                  return (
                    <View style={[props?.style, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                      <Text category='h6'>{`Výjazd: ${moment(order.date).format('DD.MM.YYYY')}`}</Text>
                      <Button appearance='outline' status='danger' accessoryLeft={DeleteIcon} onPress={() => onDeleteOrder(order.id)} />
                    </View>
                  )
                }}>
                <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text category='s1'>Množstvo:</Text>
                  <Text style={{ marginLeft: 4 }}>{`${order.volume} m³`}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text category='s1'>Cena:</Text>
                  <Text style={{ marginLeft: 4 }}>{`${order.price} €`}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text category='s1'>Číslo dokladu:</Text>
                  <Text style={{ marginLeft: 4 }}>{order.ticketId || 'Neuvedené'}</Text>
                </View>
                <View style={{}}>
                  <Text category='s1'>Poznámka:</Text>
                  <Text style={{}}>{order.note || 'Bez poznámky'}</Text>
                </View>

              </Card>
            )
          }}
        />
      )
    }
  }

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{}}>
        <TopNavigation
          accessoryLeft={() => <TopNavigationAction onPress={navigation.goBack} icon={BackIcon} />}
          title={!user ? 'Načítavam' : `${user?.firstName} ${user?.lastName}`}
          accessoryRight={() => {
            return (
              <View style={{ flexDirection: 'row' }}>
                <TopNavigationAction disabled={!user} icon={EditIcon} onPress={editUser} />
                <TopNavigationAction disabled={!user} icon={DeleteIcon} onPress={deleteUser} />
              </View>
            )
          }}
          alignment='center'
        />
        <Divider />
      </SafeAreaView>
      {renderContent()}

    </Layout>
  );
}
export default UserSecreen

const styles = StyleSheet.create({

});