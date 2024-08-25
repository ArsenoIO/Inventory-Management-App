import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyA7xJDURdp2EWPv9hdWN_3TTxBTqrhe4Pk",
  authDomain: "inventorymanagementapp-8463c.firebaseapp.com",
  projectId: "inventorymanagementapp-8463c",
  storageBucket: "inventorymanagementapp-8463c.appspot.com",
  messagingSenderId: "840030815794",
  appId: "1:840030815794:web:c0afb9240298a7c6159e2b",
  measurementId: "G-L0JXJNY2JV"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
