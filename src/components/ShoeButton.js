import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window"); // Get the screen width
const buttonWidth = width * 0.45; // Set button width to 45% of the screen width

const ShoeButton = ({ imageUrl, code, name, price, size, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { width: buttonWidth }]}
      onPress={onPress}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.shoeCodeName}>{`${code} - ${name}`}</Text>
      <Text style={styles.shoePrice}>{price}₮</Text>
      <Text style={styles.shoeSize}>Размер: {size}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#FFF",
    marginBottom: 10,
    borderWidth: 0.7,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  image: {
    width: "100%", // Image takes the full width of the button
    height: width * 0.5, // Adjust image height proportionally
    borderRadius: 10,
    marginBottom: 10,
  },
  shoeCodeName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  shoePrice: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  shoeSize: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default ShoeButton;
