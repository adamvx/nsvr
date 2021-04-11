import { type } from 'node:os';
import { BaseEntity, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IOrder, IUser } from '../types';
import User from './User';


@Entity()
export default class Order extends BaseEntity implements IOrder {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  volume: number;

  @Column("integer")
  price: number;

  @Column("text", { nullable: true })
  ticketId: string | null;

  @Column('datetime')
  date: Date;

  @Column("text", { nullable: true })
  note: string | null;

  @ManyToOne(() => User, user => user.orders)
  user: IUser;

}