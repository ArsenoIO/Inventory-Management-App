// BranchButton.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const BranchButton = ({ branchName, shoeCount, branchScreen, bgColor }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[styles.buttonContainer, { backgroundColor: bgColor }]}
      onPress={() => navigation.navigate(branchScreen)}
    >
      <View style={styles.buttonContent}>
        <Text style={styles.branchName}>{branchName}</Text>
        <Text style={styles.shoeCount}>{shoeCount}</Text>
        <Text style={styles.text}>бүртгэлтэй гутал</Text>
      </View>

      {/* Сумыг баруун дээд буланд байрлуулж байна */}
      <Icon
        name="arrow-right"
        size={24}
        color="#fff"
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "relative", // Absolute position ашиглахын тулд relative position ашиглах шаардлагатай
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: 160,
    height: 160,
  },
  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  branchName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  shoeCount: {
    flex: 1,
    fontSize: 35,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
  },
  arrowIcon: {
    position: "absolute", // Absolute байрлал ашиглаж байна
    bottom: 10, // Дээд хэсгээс 10px зайтай
    right: 10, // Баруун талаас 10px зайтай
  },
});

export default BranchButton;
