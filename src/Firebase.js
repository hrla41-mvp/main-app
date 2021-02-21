// Firebase Config File
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/app';
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_INFO,
  appId: process.env.FIREBASE_APP_ID
};
// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
export default fire;