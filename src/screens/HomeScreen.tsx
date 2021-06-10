import { useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { Divider, Icon, Input, Layout, List, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import User from '../database/User';
import { RootParamList } from '../Navigator';
import { IUser } from '../types';
import { AddIcon, SearchIcon } from '../utils/icons';

type Props = StackScreenProps<RootParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {

  const [data, setData] = useState<IUser[]>([])
  const [searchText, setSearchText] = useState<string>()
  const isFocused = useIsFocused();

  useEffect(() => {
    reloadData()
  }, [isFocused, searchText])

  const reloadData = () => {
    User.find({}).then(data => setData(filltredData(data)))
  }

  const filltredData = (data: IUser[]) => {
    const res = data.filter(x => {
      if (!searchText) return true;

      const search = searchText.toLocaleLowerCase().replace(/\s/g, '');
      const name = `${x.firstName}${x.lastName}`.toLocaleLowerCase().replace(/\s/g, '');
      const address = (x.address + x.city + x.postCode).toLocaleLowerCase().replace(/\s/g, '');
      let remove = true;

      if (name.includes(search) || address.includes(search)) {
        remove = false;
      }
      return !remove
    })
    return res.sort((a, b) => a.firstName.localeCompare(b.firstName))
  }

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title='Zákazníci'
          alignment='center'
          accessoryRight={() => (
            <TopNavigationAction
              onPress={() => navigation.navigate('AddUser')}
              icon={props => <AddIcon {...props} />} />
          )}
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
        <List
          style={{ flex: 1 }}
          data={data}
          ItemSeparatorComponent={Divider}
          renderItem={({ item, index }) => {
            const user: IUser = item
            return (
              <TouchableOpacity onPress={() => navigation.navigate('User', { userId: user.id })}>
                <Layout style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name={'person-outline'} style={{ width: 24, height: 24, tintColor: 'gray', marginRight: 16 }} />
                  <View>
                    <Text style={{ marginBottom: 2, fontWeight: 'bold' }} category='s1'>{user.firstName + " " + user.lastName}</Text>
                    <Text>{`${user.city} - ${user.address}`}</Text>
                  </View>
                </Layout>
              </TouchableOpacity>
            )
          }}
        />
      </SafeAreaView>
    </Layout>
  );
}
export default HomeScreen

const styles = StyleSheet.create({

});