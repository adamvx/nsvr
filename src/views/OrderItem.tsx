import { Button, Card, Text } from '@ui-kitten/components';
import { parsePhoneNumber } from 'libphonenumber-js';
import moment from 'moment';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IOrder, IUser } from '../types';
import { DeleteIcon } from '../utils/icons';

type Props = {
  order: IOrder
  user: IUser
  onDelete: () => void
}

const OrderItem: React.FC<Props> = ({ order, user, onDelete }) => {

  const formatNumber = (number?: string) => {
    if (!number) return '';
    try {
      return parsePhoneNumber(number, 'SK').formatNational()
    } catch (err) {
      return number
    }
  }

  return (
    <Card
      style={{ flex: 1, marginBottom: 8, borderLeftWidth: 0, borderRightWidth: 0 }}
      header={(props) => {

        return (
          <View style={[props?.style, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} >
            <Text category='h6'>{`Výjazd: ${moment(order.date).format('DD.MM.YYYY')}`}</Text>
            <Button appearance='outline' status='danger' accessoryLeft={DeleteIcon} onPress={onDelete} />
          </View>
        )
      }}>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        <Text category='s1'>Meno:</Text>
        <Text style={{ marginLeft: 4 }}>{`${user.firstName} ${user.lastName}`}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        <Text category='s1'>Adresa:</Text>
        <Text style={{ marginLeft: 4, flex: 1 }}>{`${user.address}, ${user.city}, ${user.postCode}`}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <Text category='s1'>Tel. číslo:</Text>
        <Text style={{ marginLeft: 4 }}>{`${formatNumber(user.phoneNumber)}`}</Text>
      </View>

      <View style={{ flexDirection: 'row', flex: 1, marginBottom: 4 }}>
        <Text category='s1'>Množstvo:</Text>
        <Text style={{ marginLeft: 4 }}>{`${order.volume} m³`}</Text>
      </View>
      <View style={{ flexDirection: 'row', flex: 1, marginBottom: 16 }}>
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
  );
}
export default OrderItem

const styles = StyleSheet.create({

});