import firebase from 'firebase';
import "firebase/storage";
import "firebase/firestore";
import "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import { IBackup } from '../types';
import { createBackupFile } from './backup';

interface IFirebaseBackup {
  path: string;
  createdAt: Date;
}

const firebaseConfig = {
  apiKey: "AIzaSyCdj51kmyx6Cqe_U9DDxNPWI8Vc4l1LrqU",
  authDomain: "nsvr-sk.firebaseapp.com",
  projectId: "nsvr-sk",
  storageBucket: "nsvr-sk.appspot.com",
  messagingSenderId: "286210174159",
  appId: "1:286210174159:web:9faf3c70fdd89e8e109bba",
  measurementId: "G-ZRGG1DPQQD"
};

export const initFirebase = () => {
  firebase.initializeApp(firebaseConfig);
}

const findLatestItem = async () => {
  const db = firebase.firestore();
  const doc = await db.collection('backup').orderBy('createdAt', 'desc').limit(1).get();
  const data: IFirebaseBackup[] = [];
  doc.forEach(item => {
    const d = item.data()
    data.push({
      path: d.path,
      createdAt: new firebase.firestore.Timestamp(d.createdAt.seconds, d.createdAt.nanoseconds).toDate()
    });
  })
  const backup = data[0];
  if (backup === undefined || backup === null) throw new NoBackupInFirebaseError();
  return backup;
}

export const downloadDataFirebase = async () => {
  await firebase.auth().signInAnonymously()
  const item = await findLatestItem()
  console.log(item.createdAt)
  const res = await fetch(item.path)
  const json = await res.json()
  return json as IBackup;
}

export const uploadDataFirebase = async (data: IBackup) => {
  await firebase.auth().signInAnonymously()
  const fileName = uuidv4() + '.json';

  const storageRef = firebase.storage().ref(fileName);
  const blob = await createBackupFile(fileName, data)
  await storageRef.put(blob, { contentType: 'text/json' })
  const downloadUrl = await storageRef.getDownloadURL()

  const db = firebase.firestore()
  await db.collection('backup').add({
    createdAt: new Date(),
    path: downloadUrl
  })
  console.log('Upload done!')
}