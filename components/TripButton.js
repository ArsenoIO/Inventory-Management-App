// components/TripButton.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const TripButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <View style={styles.buttonContent}>
        <Text style={styles.buttonText}>Шинээр аялал үүсгэх</Text>
        <Icon name="plus" size={18} color="#fff" style={styles.icon} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#4CAF50",
    padding: 15,
  },
  buttonContent: {
    flexDirection: "row", // Text болон Icon-ийг зэрэгцүүлнэ
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 10, // Text болон Icon-ын хооронд зай нэмнэ
  },
  icon: {
    marginLeft: 5, // Зай тохируулах
  },
});

export default TripButton;
