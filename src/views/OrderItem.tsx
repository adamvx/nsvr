import { Button, Card, Text } from '@ui-kitten/components';
import moment from 'moment';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IOrder } from '../types';
import { DeleteIcon } from '../utils/icons';

type Props = {
  order: IOrder
  onDelete: () => void
}

const OrderItem: React.FC<Props> = ({ order, onDelete }) => {

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
        <Text style={{ marginLeft: 4 }}>{`${order.user?.firstName} ${order.user?.lastName}`}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        <Text category='s1'>Adresa:</Text>
        <Text style={{ marginLeft: 4, flex: 1 }}>{`${order.user?.address}, ${order.user?.city}, ${order.user?.postCode}`}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <Text category='s1'>Tel. číslo:</Text>
        <Text style={{ marginLeft: 4 }}>{`${order.user?.phoneNumber}`}</Text>
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