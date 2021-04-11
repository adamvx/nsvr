export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  postCode: string;
  address: string;
  orders: IOrder[]
}

export interface IOrder {
  id: number
  volume: number;
  price: number;
  ticketId: string | null;
  date: Date;
  note: string | null;
  user: IUser;
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
  id: number;
  pin: number;
  createdAt: Date;
}