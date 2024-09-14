import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, BackHandler } from "react-native";
import { Text, Button, Avatar, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { removeUser } from "../services/authService";
import useUserData from "../hooks/useUserData"; // Custom Hook ашиглаж байна

const AccountScreen = () => {
  const { userData, loading, error } = useUserData(); // Custom hook ашиглан хэрэглэгчийн өгөгдөл авах
  const [dialogVisible, setDialogVisible] = useState(false);
  const [exitDialogVisible, setExitDialogVisible] = useState(false); // BackHandler-ийн диалог
  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    const backAction = () => {
      setExitDialogVisible(true); // Апп-аас гарах үед диалог харуулна
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase-аас гаргах
      await removeUser(); // AsyncStorage-аас хэрэглэгчийн өгөгдлийг устгах

      setDialogVisible(false); // ConfirmationDialog-г хаах
      navigation.replace("SignIn"); // SignIn рүү шилжүүлэх
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleBackExit = async () => {
    try {
      await signOut(auth); // Firebase-аас гаргах
      await removeUser(); // AsyncStorage-аас хэрэглэгчийн өгөгдлийг устгах
      setExitDialogVisible(false); // Диалогыг хаах
      navigation.replace("SignIn"); // SignIn рүү шилжүүлэх
    } catch (error) {
      console.error("Error signing out on back press: ", error);
    }
  };

  if (loading) {
    return <Text>Ачааллаж байна...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

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

      {/* Logout хийх үед харуулах ConfirmationDialog */}
      <ConfirmationDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onConfirm={handleLogout}
        title="Анхааруулга"
        content="Та Апп-аас гарахдаа итгэлтэй байна уу?"
      />

      {/* BackHandler ашиглан апп-аас гарахыг асуух ConfirmationDialog */}
      <ConfirmationDialog
        visible={exitDialogVisible}
        onDismiss={() => setExitDialogVisible(false)}
        onConfirm={handleBackExit} // Back дарахад SignIn рүү буцдаг болгож өөрчлөх
        title="Анхааруулга"
        content="Та апп-аас гарахдаа итгэлтэй байна уу?"
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
    backgroundColor: "#03A9F4",
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
