// Firebase Config File
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/app';
const path = require('path');

const firebaseConfig = {
  apiKey: 'AIzaSyA1qB6fzlOy42eu-HXNUfiSz3pURyKQRzM',
  authDomain: 'mvp-development-9d206.firebaseapp.com',
  projectId: 'mvp-development-9d206',
  storageBucket: 'mvp-development-9d206.appspot.com',
  messagingSenderId: '967297007248',
  appId: '1:967297007248:web:289f61d989e7f1911a2215'
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
export default fire;

/*
require('dotenv').config({ path: path.join(__dirname, '..', '.env')});
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_INFO,
  appId: process.env.FIREBASE_APP_ID
};

console.log(process.env.FIREBASE_API_KEY);
console.log(process.env.FIREBASE_AUTH_DOMAIN);
console.log(process.env.FIREBASE_PROJECT_ID);
console.log(process.env.FIREBASE_STORAGE_BUCKET);
console.log(process.env.FIREBASE_MESSAGING_SENDER_INFO);
console.log(process.env.FIREBASE_APP_ID);
*/