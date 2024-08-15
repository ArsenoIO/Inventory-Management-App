import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { auth, firestore } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("No user is logged in!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSignOut = () => {
    Alert.alert("Гарах", "Та гарахдаа итгэлтэй байна уу?", [
      {
        text: "Болих",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Гарах",
        onPress: async () => {
          await signOut(auth);
          navigation.replace("SignInScreen");
        },
      },
    ]);
  };

  if (loading) {
    return <Text>Ачааллаж байна...</Text>;
  }

  if (!userData) {
    return <Text>Хэрэглэгчийн мэдээлэл олдсонгүй.</Text>;
  }

  return (
    <View style={styles.container}>
      <Avatar.Icon size={100} icon="account" />
      <Text style={styles.text}>Нэр: {userData.name}</Text>
      <Text style={styles.text}>Бүртгэлтэй хаяг: {userData.email}</Text>
      <Text style={styles.text}>Салбар: {userData.branch}</Text>
      <Button title="Гарах" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default ProfileScreen;
