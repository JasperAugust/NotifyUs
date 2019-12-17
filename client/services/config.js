import * as firebase from 'firebase';
let config = {
  apiKey: 'AIzaSyCQFji7lw-gbu_TIj6pXkRGT_UQbj4bSAA',
  authDomain: 'notify-a8b04.firebaseapp.com',
  databaseURL: 'https://notify-a8b04.firebaseio.com',
  projectId: 'notify-a8b04',
  storageBucket: 'notify-a8b04.appspot.com',
  messagingSenderId: '447396222918',
  appId: '1:447396222918:web:16b3ecedc8e60bbe6984c7',
  measurementId: 'G-RFEJTFJNN3',
};
export const firebaseApp = firebase.initializeApp(config);
