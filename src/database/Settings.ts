import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ISettings } from '../types';

@Entity()
export default class Settings extends BaseEntity implements ISettings {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  pin: number;

  @Column('boolean')
  darkMode: boolean;

  @CreateDateColumn()
  createdAt: Date;

}

export async function findLatest() {
  const res = await Settings.find({})
  if (res.length === 0) return undefined;
  return res.reduce((a, b) => {
    return a.createdAt > b.createdAt ? a : b;
  })
}

export async function findOrCreate() {
  const res = await findLatest();
  if (res === undefined) {
    const settings = new Settings();
    settings.pin = 1111;
    settings.darkMode = false;
    return await settings.save()
  }
  return res;
}