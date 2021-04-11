import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IOrder, IUser } from '../types';
import Order from './Order';

@Entity()
export default class User extends BaseEntity implements IUser {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  firstName: string;

  @Column("text")
  lastName: string;

  @Column("text")
  phoneNumber: string;

  @Column("text")
  city: string;

  @Column("text")
  postCode: string;

  @Column("text")
  address: string;

  @OneToMany(() => Order, order => order.user)
  orders: IOrder[];

}