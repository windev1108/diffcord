// Import the functions you need from the SDKs you need
import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage } from 'firebase/storage'
import firebase from 'firebase/compat/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app =  firebase.initializeApp({
  apiKey: "AIzaSyC9CkKvvs0o7c3hv6O5ID7uemQ-Y7a8RMs",
  authDomain: "winchat-206bf.firebaseapp.com",
  databaseURL: "https://winchat-206bf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "winchat-206bf",
  storageBucket: "winchat-206bf.firebasestorage.app",
  messagingSenderId: "396424793479",
  appId: "1:396424793479:web:e82e17dba5fb43a0b89722",
  measurementId: "G-EWRS3QR6EZ"
});

// Initialize Firebase
firebase.analytics();


// init services
const auth = firebase.auth();
const db = firebase.firestore();


// Firebase storage reference
const storage = getStorage(app);

export { db , auth , storage }
export default firebase;
