export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  postCode: string;
  address: string;
  orders: IOrder[]
}

export interface IOrder {
  id: string
  volume: number;
  price: number;
  ticketId: string | null;
  date: Date;
  note: string | null;
}

export interface IBackup {
  users: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    city: string;
    postCode: string;
    address: string;
    orders: {
      volume: number;
      price: number;
      ticketId: string | null;
      date: Date;
      note: string | null;
    }[]
  }[]
}

export interface ISettings {
  id: string;
  pin: number;
  darkMode: boolean;
}

export enum EEvnentType {
  DarkMode = 'DarkMode'
}