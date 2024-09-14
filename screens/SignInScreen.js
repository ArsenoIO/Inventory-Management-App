import React, { useState } from "react";
import { StyleSheet, Image, Alert, View, Text } from "react-native";
import { auth } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import TextInput from "../components/TextInput";
import CustomButton from "../components/CustomButton";
import { storeUser } from "../services/authService"; // Хэрэглэгчийн статусыг хадгалах

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Хэрэглэгчийн статусыг хадгалах
      await storeUser(user);
      // Амжилттай нэвтэрсэн бол Main дэлгэц рүү шилжих
      navigation.navigate("Main");
    } catch (error) {
      console.log(error);
      Alert.alert("Sign in failed: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.header}>Орос цаатан</Text>
      <TextInput
        placeholder="Email"
        returnKeyType="next"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        returnKeyType="done"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <CustomButton mode="contained" onPress={handleSignIn}>
        НЭВТРЭХ
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    paddingVertical: 10,
    marginBottom: 20,
    alignSelf: "center",
  },
});
