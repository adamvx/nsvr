import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ISettings } from '../types';

@Entity()
export default class Settings extends BaseEntity implements ISettings {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  pin: number;

  @CreateDateColumn()
  createdAt: Date;

}

export async function findLatest() {
  const res = await Settings.find({})
  return res.reduce((a, b) => {
    return a.createdAt > b.createdAt ? a : b;
  })
}

export async function findOrCreate() {
  const res = await Settings.find({});
  if (res.length === 0) {
    const settings = new Settings();
    settings.pin = 1111;
    await settings.save()
  }
}