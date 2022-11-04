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
  apiKey:"AIzaSyBeHdiDzW3YdjqtdkQR2gyxZovSCguH86E",
  authDomain:"discord-6e069.firebaseapp.com",
  appId:"1:931526430448:web:ec44992d5e47446d893c35",
  databaseURL:"https://discord-6e069-default-rtdb.firebaseio.com",
  projectId:"discord-6e069",
  storageBucket:"discord-6e069.appspot.com",
  messagingSenderId:"931526430448",
  measurementId:"G-G8GXTF79DB"
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
