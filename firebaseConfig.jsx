// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import firebase from 'firebase/app';
import 'firebase/firestore';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCj7iJgIwKQTP7Jc-w4GLbPtL6uuPDQ4iY",
  authDomain: "shoeapp-399ad.firebaseapp.com",
  projectId: "shoeapp-399ad",
  storageBucket: "shoeapp-399ad.appspot.com",
  messagingSenderId: "1070555187722",
  appId: "1:1070555187722:web:36ffcc5da7b02e16b22df3",
  measurementId: "G-30SQV4E1XV"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export { firebase }
// Initialize Firestore






