import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import { getAuth, signOut } from "firebase/auth";
import { removeUser } from "../services/authService";
import useUserData from "../hooks/useUserData"; // Custom Hook ашиглаж байна

const AccountScreen = () => {
  const { userData, loading, error } = useUserData(); // Custom hook ашиглан хэрэглэгчийн өгөгдөл ава

  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase-аас гаргах
      await removeUser(); // AsyncStorage-аас хэрэглэгчийн өгөгдлийг устгах
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const showLogoutConfirmation = () => {
    Alert.alert(
      "Анхааруулга",
      "Та Апп-аас гарахдаа итгэлтэй байна уу?",
      [
        {
          text: "Үгүй",
          style: "cancel",
        },
        {
          text: "Тийм",
          onPress: handleLogout,
        },
      ],

      { cancelable: false }
    );
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
            <Avatar
              size={40}
              rounded
              icon={{ name: "user", type: "font-awesome" }}
              containerStyle={styles.profileIcon}
            />
            <Text style={styles.name}>{userData.userName || "User"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Салбар :</Text>
            <Text style={styles.value}>{userData.branch}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Роль :</Text>
            <Text style={styles.value}>{userData.userRole}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Утас :</Text>
            <Text style={styles.value}>{userData.userPhoneNumber}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>email :</Text>
            <Text style={styles.value}>{userData.email}</Text>
          </View>
        </View>
      )}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={showLogoutConfirmation} // Logout хийх үед Alert харуулах
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFF",
    padding: 10,
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
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 5,
  },
  logoutButton: {
    backgroundColor: "#CE5A67",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AccountScreen;
