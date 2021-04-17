import { StackScreenProps } from '@react-navigation/stack';
import { Button, Divider, Input, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import User from '../database/User';
import { RootParamList } from '../Navigator';
import { BackIcon } from '../utils/icons';
import { addUserSchema } from '../utils/validationSchemas';

type Props = StackScreenProps<RootParamList, 'AddUser'>;

const AddUserScreen: React.FC<Props> = ({ navigation, route }) => {
  const userId = route.params?.userId
  const isEdit = userId !== undefined
  const [loadedUser, setLoadedUser] = useState<User>()

  useEffect(() => {
    if (userId) {
      User.findOne({ id: userId }).then(user => {
        setLoadedUser(user);
      }).catch(console.error)
    }
  }, [userId])

  const initialValues = {
    firstName: loadedUser?.firstName || '',
    lastName: loadedUser?.lastName || '',
    phoneNumber: loadedUser?.phoneNumber || '',
    city: loadedUser?.city || '',
    postCode: loadedUser?.postCode || '',
    address: loadedUser?.address || '',
  }

  const save = async (firstName?: string, lastName?: string, phoneNumber?: string, city?: string, postCode?: string, address?: string) => {
    const user = isEdit && loadedUser ? loadedUser : new User()
    user.firstName = firstName ?? ""
    user.lastName = lastName ?? ""
    user.phoneNumber = phoneNumber ?? ""
    user.city = city ?? ""
    user.postCode = postCode ?? ""
    user.address = address ?? ""
    user.orders = []
    try {
      await user.save()
      navigation.goBack()
    } catch (err) {
      Alert.alert('User', JSON.stringify(user))
      Alert.alert('Err', err.name + " " + err.message + " " + err.stack)
    }

  }


  const renderContent = () => {
    if (isEdit && !loadedUser) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator size='small' color='gray' animating={true} />
        </View>
      )
    } else {
      return (
        <Formik
          validationSchema={addUserSchema}
          initialValues={initialValues}

          onSubmit={values => save(values.firstName, values.lastName, values.phoneNumber, values.city, values.postCode, values.address)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
            <View>
              <Input
                placeholder='Meno'
                style={{ marginBottom: 8 }}
                value={values.firstName}
                onBlur={handleBlur('firstName')}
                onChangeText={handleChange('firstName')}
                status={errors.firstName && touched.firstName ? 'danger' : 'basic'}
                caption={touched.firstName ? errors.firstName : undefined}
                textContentType={'givenName'}
              />
              <Input
                placeholder='Priezvisko'
                style={{ marginBottom: 8 }}
                value={values.lastName}
                onBlur={handleBlur('lastName')}
                onChangeText={handleChange('lastName')}
                status={errors.lastName && touched.lastName ? 'danger' : 'basic'}
                caption={touched.lastName ? errors.lastName : undefined}
                textContentType={'familyName'}
              />
              <Input
                placeholder='Telefónne číslo'
                style={{ marginBottom: 8 }}
                value={values.phoneNumber}
                onBlur={handleBlur('phoneNumber')}
                onChangeText={handleChange('phoneNumber')}
                status={errors.phoneNumber && touched.phoneNumber ? 'danger' : 'basic'}
                caption={touched.phoneNumber ? errors.phoneNumber : undefined}
                textContentType={'telephoneNumber'}
                keyboardType={'phone-pad'}
              />
              <View style={{ flexDirection: 'row' }}>
                <Input
                  placeholder='Mesto'
                  style={{ marginBottom: 8, marginRight: 4, flex: 1 }}
                  value={values.city}
                  onBlur={handleBlur('city')}
                  onChangeText={handleChange('city')}
                  status={errors.city && touched.city ? 'danger' : 'basic'}
                  caption={touched.city ? errors.city : undefined}
                  textContentType={'addressCity'}
                />
                <Input
                  placeholder='PSČ'
                  style={{ marginBottom: 8, marginLeft: 4, flex: 1 }}
                  value={values.postCode}
                  onBlur={handleBlur('postCode')}
                  onChangeText={handleChange('postCode')}
                  status={errors.postCode && touched.postCode ? 'danger' : 'basic'}
                  caption={touched.postCode ? errors.postCode : undefined}
                  textContentType={'postalCode'}
                  keyboardType={'numeric'}
                />
              </View>
              <Input
                placeholder='Ulica a číslo'
                style={{ marginBottom: 8 }}
                value={values.address}
                onBlur={handleBlur('address')}
                onChangeText={handleChange('address')}
                status={errors.address && touched.address ? 'danger' : 'basic'}
                caption={touched.address ? errors.address : undefined}
                textContentType={'fullStreetAddress'}
              />
              <Button onPress={handleSubmit}>{isEdit ? 'Uložiť zákazníka' : 'Vytvoriť zákazníka'}</Button>
            </View>
          )}
        </Formik>
      )
    }
  }


  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          accessoryLeft={() => <TopNavigationAction onPress={navigation.goBack} icon={BackIcon} />}
          title={isEdit ? 'Upraviť zákazníka' : 'Pridať zákazníka'}
          alignment='center'
        />
        <Divider />
        <Layout level='2' style={{ flex: 1, padding: 16 }}>
          {renderContent()}
        </Layout>
      </SafeAreaView>
    </Layout>
  );
}
export default AddUserScreen

const styles = StyleSheet.create({

});

function useInputState() {
  throw new Error('Function not implemented.');
}
