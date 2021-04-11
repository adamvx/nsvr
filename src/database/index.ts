import * as ExpoSQLite from 'expo-sqlite';
import "reflect-metadata";
import { createConnection } from "typeorm";
import Order from './Order';
import Settings from './Settings';
import User from './User';

const entries = [User, Order, Settings]

export const makeDatabaseConnection = async () => {

  return await createConnection({
    type: 'expo',
    driver: ExpoSQLite,
    database: "nsvr",
    entities: entries,
    synchronize: true
  })

}
