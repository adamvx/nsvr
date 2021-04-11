import * as FileSystem from 'expo-file-system';
import { IBackup, IUser } from '../types';

const backupDir = FileSystem.cacheDirectory + 'backup/';

async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(backupDir);
  if (!dirInfo.exists) {
    console.log("Backup directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });
  }
}

export const createBackupFile = async (fileName: string, data: any) => {
  await ensureDirExists();
  const fileUri = backupDir + fileName;
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data), { encoding: 'utf8' })
  const response = await fetch(fileUri)
  await FileSystem.deleteAsync(fileUri)
  return await response.blob()
}

export const mapUserToBackup = (user: IUser[]) => {
  const backup: IBackup = {
    users: user.map(x => {
      return {
        firstName: x.firstName,
        lastName: x.lastName,
        phoneNumber: x.phoneNumber,
        city: x.city,
        postCode: x.postCode,
        address: x.address,
        orders: (x.orders || []).map(x => {
          return {
            volume: x.volume,
            price: x.price,
            ticketId: x.ticketId,
            date: x.date,
            note: x.note,
          }
        })
      }
    })
  }
  return backup;
}