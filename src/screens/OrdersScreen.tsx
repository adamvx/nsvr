import { useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { Divider, Input, InputProps, Layout, List, Text, Tooltip, TopNavigation } from '@ui-kitten/components';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, ImageProps, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Order from '../database/Order';
import { RootParamList } from '../Navigator';
import { IOrder } from '../types';
import { HelpIcon, SearchIcon } from '../utils/icons';
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

  const normalized = (string: string) => {
    return string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '');
  }

  const filltredData = (data: IOrder[]) => {
    const res = data.filter(x => {
      if (!searchText) return true;
      if (x.user === null) return false;

      const search = normalized(searchText);
      const name = normalized(`${x.user.firstName}${x.user.lastName}`);
      const address = (x.user.address + x.user.city + x.user.postCode).toLocaleLowerCase().replace(/\s/g, '');
      const date = normalized(moment(x.date).format('DD.MM.YYYY'));
      const dateShort = normalized(moment(x.date).format('D.M.YYYY'));
      const month = normalized(moment(x.date).format('MMMM'));
      console.log(dateShort, search)
      let remove = true;

      if (name.includes(search) || address.includes(search) || date.includes(search) || dateShort.includes(search) || month.includes(search)) {
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

  const [showHelp, setShowHelp] = useState(false);

  const helpIcon = (props?: Partial<ImageProps>) => {
    return (
      <TouchableWithoutFeedback onPress={() => setShowHelp(!showHelp)}>
        <HelpIcon {...props} />
      </TouchableWithoutFeedback>
    )
  }

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title='Výjazdy'
          alignment='center'
        />
        <Layout>
          <Tooltip
            anchor={(props) => {
              return (
                <Input
                  value={searchText}
                  placeholder='Hľadať...'
                  style={{ paddingHorizontal: 16, paddingBottom: 8 }}
                  accessoryLeft={SearchIcon}
                  accessoryRight={helpIcon}
                  onChangeText={nextValue => setSearchText(nextValue)}
                />
              )
            }}
            visible={showHelp}
            onBackdropPress={() => setShowHelp(false)}>
            {'Príklady vyhľadávania:\n- 01.04.2021\n- 1.4.2021\n- 1.4\n- 2021\n- marec\n- MenoPriezvisko\n- Priezvisko\n- Meno\n- Majerský rad 3\n- Sladkovicova\n- Krupina\n- 96301'}

          </Tooltip>

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