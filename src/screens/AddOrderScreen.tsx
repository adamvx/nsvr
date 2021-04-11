import { StackScreenProps } from '@react-navigation/stack';
import { Button, Datepicker, Divider, I18nConfig, Icon, Input, Layout, NativeDateService, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { Formik } from 'formik';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Order from '../database/Order';
import User from '../database/User';
import { RootParamList } from '../Navigator';
import { BackIcon } from '../utils/icons';
import { addOrderSchema } from '../utils/validationSchemas';


type Props = StackScreenProps<RootParamList, 'AddOrder'>;


type UserInput = {
  volume: string,
  price: string,
  ticketId?: string,
  date: Date,
  note?: string
}

const AddOrderScreen: React.FC<Props> = ({ navigation, route }) => {

  const initialValues: UserInput = {
    volume: '',
    price: '',
    ticketId: undefined,
    date: new Date(),
    note: undefined
  }

  const save = async (volume: string, price: string, date: Date, ticketId?: string, note?: string) => {
    const user = await User.findOne(route.params.userId)
    if (user) {
      const order = new Order()
      order.volume = parseInt(volume ?? "")
      order.price = parseInt(price ?? "")
      order.ticketId = ticketId ?? null
      order.date = date
      order.note = note ?? null
      order.user = user
      await order.save();
      navigation.goBack()
    }
  }


  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          accessoryLeft={() => <TopNavigationAction onPress={navigation.goBack} icon={BackIcon} />}
          title='Pridať výjazd'
          alignment='center'
        />
        <Divider />
        <Layout style={{ flex: 1, padding: 16 }}>
          <Formik
            validationSchema={addOrderSchema}
            initialValues={initialValues}
            onSubmit={values => {
              save(values.volume, values.price, values.date, values.ticketId, values.note)
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, touched, errors }) => (
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <Input
                    placeholder='Množstvo v m³'
                    style={{ marginBottom: 8, marginRight: 4, flex: 1 }}
                    value={values.volume}
                    onBlur={handleBlur('volume')}
                    onChangeText={handleChange('volume')}
                    status={errors.volume && touched.volume ? 'danger' : 'basic'}
                    caption={touched.volume ? errors.volume : undefined}
                    keyboardType={'numeric'}
                  />
                  <Input
                    placeholder='Cena v €'
                    style={{ marginBottom: 8, marginLeft: 4, flex: 1 }}
                    value={values.price}
                    onBlur={handleBlur('price')}
                    onChangeText={handleChange('price')}
                    status={errors.price && touched.price ? 'danger' : 'basic'}
                    caption={touched.price ? errors.price : undefined}
                    keyboardType={'numeric'}
                  />
                </View>
                <Input
                  placeholder='Číslo dokladu'
                  style={{ marginBottom: 8 }}
                  value={values.ticketId}
                  onBlur={handleBlur('ticketId')}
                  onChangeText={handleChange('ticketId')}
                  status={errors.ticketId && touched.ticketId ? 'danger' : 'basic'}
                  caption={touched.ticketId ? errors.ticketId : undefined}
                  autoCorrect={false}
                  autoCapitalize={'characters'}
                />

                <Datepicker
                  placeholder='Vyberte dátum'
                  date={values.date}
                  style={{ marginBottom: 8 }}
                  dateService={localeDateService as any}
                  onSelect={date => setFieldValue('date', date)}
                  status={errors.date && touched.date ? 'danger' : 'basic'}
                />

                <Input
                  placeholder='Poznámka'
                  style={{ marginBottom: 8 }}
                  textStyle={{ minHeight: 64 }}
                  multiline
                  value={values.note}
                  onBlur={handleBlur('note')}
                  onChangeText={handleChange('note')}
                  status={errors.note && touched.note ? 'danger' : 'basic'}
                  caption={touched.note ? errors.note : undefined}
                />

                <Button onPress={handleSubmit}>Uložiť výjazd</Button>
              </View>
            )}
          </Formik>

        </Layout>
      </SafeAreaView>
    </Layout>
  );
}
export default AddOrderScreen

const styles = StyleSheet.create({

});

const i18n: I18nConfig = {
  dayNames: {
    short: ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'],
    long: ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa'],
  },
  monthNames: {
    short: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
    long: [
      'Január',
      'Ferbuár',
      'Marec',
      'Apríl',
      'Máj',
      'Jún',
      'Júl',
      'August',
      'September',
      'Október',
      'November',
      'December',
    ],
  },
};

const localeDateService = new NativeDateService('sk', { i18n, startDayOfWeek: 0, format: 'DD.MM.YYYY' });
