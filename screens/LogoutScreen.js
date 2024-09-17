import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth"; // Firebase-ийн системээс гарах функц

const LogoutScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Alert.alert("Амжилттай", "Та системээс гарлаа.");
        navigation.navigate("Main"); // Системээс гарсны дараа Main дэлгэц рүү шилжүүлнэ
      })
      .catch((error) => {
        console.error("Системээс гарахад алдаа гарлаа: ", error);
        Alert.alert("Алдаа", "Системээс гарахад алдаа гарлаа.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Та системээс гарах уу?</Text>
      <View style={styles.buttonContainer}>
        <Button title="Тийм" onPress={handleLogout} color="#d32f2f" />
        <Button
          title="Үгүй"
          onPress={() => navigation.goBack()}
          color="#4CAF50"
        />
      </View>
    </View>
  );
};

export default LogoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
  },
});
