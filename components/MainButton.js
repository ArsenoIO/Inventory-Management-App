import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const MainButton = ({ title, onPress, bgColor, iconSource }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      <Image source={iconSource} style={styles.icon} />

      <View style={styles.textContainer}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 150, // Баганад илүү тэгш харагдуулахын тулд өндөр нэмнэ
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden", // Давхарласан зургийг товчны хилээс хэтрүүлэхгүй
  },
  icon: {
    width: 85, // Зургыг томруулж байна
    height: 85,
    position: "absolute", // Давхарлаж байрлуулахад хэрэглэнэ
    opacity: 0.15, // Араас бүдэг харагдуулна
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", // Давхарлаж текстийг голд харуулахад хэрэглэнэ
  },
  buttonText: {
    fontSize: 17,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MainButton;
