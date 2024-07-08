// firebase.js
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj7iJgIwKQTP7Jc-w4GLbPtL6uuPDQ4iY",
  authDomain: "shoeapp-399ad.firebaseapp.com",
  projectId: "shoeapp-399ad",
  storageBucket: "shoeapp-399ad.appspot.com",
  messagingSenderId: "1070555187722",
  appId: "1:1070555187722:web:36ffcc5da7b02e16b22df3",
  measurementId: "G-30SQV4E1XV",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export default firebase;
