import { useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { Divider, Input, Layout, List, TopNavigation } from '@ui-kitten/components';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet } from 'react-native';
import Order from '../database/Order';
import { RootParamList } from '../Navigator';
import { IOrder } from '../types';
import { SearchIcon } from '../utils/icons';
import OrderItem from '../views/OrderItem';


type Props = StackScreenProps<RootParamList, 'Orders'>;

const OrdersScreen: React.FC<Props> = ({ navigation }) => {

  const [data, setData] = useState<IOrder[]>([])
  const [searchText, setSearchText] = useState<string>()
  const isFocused = useIsFocused();

  useEffect(() => {
    reloadData();
  }, [isFocused, searchText])

  const reloadData = () => {
    Order.find({ relations: ["user"] }).then(data => setData(filltredData(data)))
  }

  const filltredData = (data: IOrder[]) => {
    const res = data.filter(x => {
      if (!searchText) return true;
      if (x.user === null) return false;

      const search = searchText.toLocaleLowerCase().replace(/\s/g, '');
      const name = `${x.user.firstName}${x.user.lastName}`.toLocaleLowerCase().replace(/\s/g, '');
      const address = (x.user.address + x.user.city + x.user.postCode).toLocaleLowerCase().replace(/\s/g, '');
      const date = (moment(x.date).format('DD.MM.YYYY')).toLocaleLowerCase().replace(/\s/g, '');
      console.log(date, search)
      let remove = true;

      if (name.includes(search) || address.includes(search) || date.includes(search)) {
        remove = false;
      }
      return !remove
    })
    return res.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  const onDeleteOrder = (id: number) => {
    Alert.alert(
      'Potvrdenie vymazania',
      'Naozaj chcete tento záznam vymazať? Táto operácia je nenávratná',
      [
        {
          text: 'Áno', style: 'destructive', onPress: () => {
            Order.delete({ id: id })
              .then(() => reloadData())
              .catch(() => Alert.alert('Vyskytla sa chyba', 'Z nejakého dôvodu sa nepodaril záznam vymazať'))
          }
        },
        { text: 'Nie' }
      ])

  }

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title='Výjazdy'
          alignment='center'
        />
        <Layout>
          <Input
            value={searchText}
            placeholder='Hľadať...'
            style={{ paddingHorizontal: 16, paddingBottom: 8 }}
            accessoryLeft={SearchIcon}
            onChangeText={nextValue => setSearchText(nextValue)}
          />
        </Layout>
        <Divider />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <List
            style={{ flex: 1 }}
            data={data}
            contentContainerStyle={{ paddingTop: 8 }}
            renderItem={({ item, index }) => {
              const order: IOrder = item
              return (
                <OrderItem
                  onDelete={() => onDeleteOrder(order.id)}
                  order={order} />
              )
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Layout>
  );
}
export default OrdersScreen

const styles = StyleSheet.create({

});