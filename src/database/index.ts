import * as ExpoSQLite from 'expo-sqlite';
import "reflect-metadata";
import { createConnection, getConnection, ConnectionOptions } from "typeorm";
import Order from './Order';
import Settings from './Settings';
import User from './User';

const entries = [User, Order, Settings]

export const makeDatabaseConnection = async () => {

  const options: ConnectionOptions = {
    type: 'expo',
    driver: ExpoSQLite,
    database: "nsvr-db",
    entities: entries,
    synchronize: true
  }

  try {
    await getConnection(options.name).close();
    return createConnection(options);
  } catch (error) {
    return createConnection(options);
  }

}
