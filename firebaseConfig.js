// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzdriIgRGmrAMmbjh0ly4ExVe_t0YPyzA",
  authDomain: "inventory-management-568f5.firebaseapp.com",
  projectId: "inventory-management-568f5",
  storageBucket: "inventory-management-568f5.appspot.com",
  messagingSenderId: "231269817561",
  appId: "1:231269817561:web:d92ed3431e8768a615b2c8",
  measurementId: "G-KVW7HPK5Q6",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { app, firestore, auth };
