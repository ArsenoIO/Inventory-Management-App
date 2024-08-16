import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { auth, firestore } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Button from "../components/Button";

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
      <Avatar.Icon size={100} icon="account" style={styles.row} />

      <View style={styles.row}>
        <Text style={styles.label}>Нэр:</Text>
        <Text style={styles.input}> {userData.name}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Бүртгэлтэй хаяг: </Text>
        <Text style={styles.input}>{userData.email}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Салбар: </Text>

        <Text style={styles.input}>{userData.branch}</Text>
      </View>

      <Button
        mode="contained-tonal"
        buttonColor="#CE5A67"
        textColor="#FCF5ED"
        icon="logout"
        onPress={handleSignOut}
      >
        Гарах
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "top",
    alignItems: "left",
    padding: 20,
    marginTop: "10%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  label: {
    width: "45%",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    fontSize: 20,
    fontWeight: "light",
  },
});

export default ProfileScreen;
