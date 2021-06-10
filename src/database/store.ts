import AsyncStorage from '@react-native-async-storage/async-storage';
import { IOrder, ISettings, IUser } from '../types';

const defaultSettings: ISettings = {
  id: '',
  pin: 1111,
  darkMode: false
}

enum StoreParam {
  Settings = '@db_settings',
  Users = '@db_users',
}

export const storeSettings = async (data: ISettings) => {
  await AsyncStorage.setItem(StoreParam.Settings, JSON.stringify(data))
}

export const loadSettings = async (): Promise<ISettings> => {
  const res = await AsyncStorage.getItem(StoreParam.Settings)
  if (res) {
    return JSON.parse(res)
  } else {
    await storeSettings(defaultSettings)
    return defaultSettings
  }
}

export const storeUsers = async (data: IUser[] | undefined) => {
  await AsyncStorage.setItem(StoreParam.Users, JSON.stringify(data))
}

export const loadUsers = async (): Promise<IUser[]> => {
  const res = await AsyncStorage.getItem(StoreParam.Users)
  if (res) return JSON.parse(res)
  return Promise.reject()
}

export const loadOrders = async (): Promise<IOrder[]> => {
  const res = await AsyncStorage.getItem(StoreParam.Users)
  if (res) {
    const users: IUser[] = JSON.parse(res)
    return users.flatMap(x => x.orders)
  }
  return Promise.reject()
}

export const deleteUser = async (id: string): Promise<void> => {
  const res = await AsyncStorage.getItem(StoreParam.Users);
  if (res) {
    let users: IUser[] = JSON.parse(res);
    users = users.filter(x => x.id !== id);
    storeUsers(users);
  }
  else Promise.reject()
}

export const findUser = async (id: string): Promise<IUser> => {
  const res = await AsyncStorage.getItem(StoreParam.Users)
  if (res) {
    const users: IUser[] = JSON.parse(res);
    const user = users.find(x => x.id === id)
    if (user) return user
    else return Promise.reject()
  }
  return Promise.reject()
}

export const addUser = async (user: IUser): Promise<void> => {
  const res = await AsyncStorage.getItem(StoreParam.Users)
  if (res) {
    storeUsers([...JSON.parse(res), user])
  }
  else Promise.reject()
}

export const addOrder = async (userId: string, order: IOrder): Promise<void> => {
  const res = await AsyncStorage.getItem(StoreParam.Users)
  if (res) {
    let users: IUser[] = JSON.parse(res);
    const i = users.findIndex(x => x.id === userId)
    if (i > -1) {
      users[i].orders.push(order)
      storeUsers(users)
    } else {
      Promise.reject()
    }
  }
  else Promise.reject()
}

export const deleteOrder = async (id: string): Promise<void> => {
  const res = await AsyncStorage.getItem(StoreParam.Users);
  if (res) {
    let users: IUser[] = JSON.parse(res);
    const user = await findUserByOrderId(id)
    user.orders = user.orders.filter(x => x.id !== id);
    const i = users.findIndex(x => x.id == user.id)
    if (i > -1) {
      users[i] = user
      await storeUsers(users);
    } else {
      Promise.reject()
    }
  } else {
    Promise.reject()
  }
}

export const findUserByOrderId = async (id: string): Promise<IUser> => {
  const res = await AsyncStorage.getItem(StoreParam.Users);
  if (res) {
    const users: IUser[] = JSON.parse(res);
    for (const user of users) {
      for (const order of user.orders) {
        if (order.id == id) return user
      }
    }
    return Promise.reject()
  }
  return Promise.reject()
}
