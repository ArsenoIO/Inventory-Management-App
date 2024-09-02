// SignInScreen.js
import React, { useState } from "react";
import { StyleSheet, Image, Alert } from "react-native";
import { auth } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import Header from "../components/Header";
import Background from "../components/Background";
import TextInput from "../components/TextInput";
import CustomButton from "../components/CustomButton";

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
      navigation.navigate("Main");
    } catch (error) {
      console.log(error);
      Alert.alert("Sign in failed :" + error.message);
    }
  };

  return (
    <Background>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Header>Орос цаатан</Header>
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
    </Background>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
});
