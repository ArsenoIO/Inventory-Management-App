import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Text, Button, Avatar, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { BackHandler } from "react-native";

const AccountScreen = () => {
  const [userData, setUserData] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Анхааруулга", "Та апп-аас гарах уу?", [
        {
          text: "Үгүй",
          onPress: () => null,
          style: "cancel",
        },
        { text: "Тийм", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchUserData();
  }, [auth, firestore]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("SignIn");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {userData && (
        <View style={styles.profileContainer}>
          <View style={styles.iconAndName}>
            <Avatar.Icon size={60} icon="account" style={styles.profileIcon} />
            <Text style={styles.name}>{userData.userName || "User"}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Салбар :</Text>
            <Text style={styles.value}>{userData.branch}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Роль :</Text>
            <Text style={styles.value}>{userData.userRole}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Утас :</Text>
            <Text style={styles.value}>{userData.userPhoneNumber}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>email :</Text>
            <Text style={styles.value}>{userData.email}</Text>
          </View>
        </View>
      )}
      <Button
        mode="contained"
        onPress={() => setDialogVisible(true)}
        style={styles.logoutButton}
      >
        Logout
      </Button>

      <ConfirmationDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onConfirm={handleLogout}
        title="Анхааруулга"
        content="Та Апп-аас гарахдаа итгэлтэй байна уу?"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFF",
    marginTop: "15%",
    marginRight: "5%",
    marginLeft: "5%",
  },
  profileContainer: {
    marginBottom: 20,
  },
  iconAndName: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileIcon: {
    marginRight: 10,
    backgroundColor: "#CE5A67",
  },
  name: {
    fontSize: 24,
    color: "#1F1717",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
    color: "#1F1717",
  },
  value: {
    fontSize: 18,
    color: "#1F1717",
    textAlign: "right",
  },
  divider: {
    marginVertical: 5,
  },
  logoutButton: {
    backgroundColor: "#CE5A67",
  },
});

export default AccountScreen;
