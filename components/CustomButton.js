import React from "react";
import { Button as PaperButton } from "react-native-paper";
import { StyleSheet } from "react-native";

export default function CustomButton({ mode, style, ...props }) {
  // Determine the color based on the mode
  const buttonColor = (() => {
    switch (mode) {
      case "outlined":
        return "#D3D3D3"; // Blue color for outlined
      case "contained":
        return "#F6A609"; // Red color for contained
      case "elevated":
        return "#FFFFFF"; // Purple color for elevated
      case "text":
        return "transparent"; // Transparent for text mode
      case "exit":
        return "#973131";
      default:
        return undefined; // Default color
    }
  })();

  // Determine the text color based on the mode
  const textColor = (() => {
    switch (mode) {
      case "text":
        return "#4f454b"; // Lighter blue for text
      case "exit":
        return "#FCF5ED"; // Light color for exit
      default:
        return undefined; // Default text color
    }
  })();

  return (
    <PaperButton
      style={[styles.button, style]}
      labelStyle={[styles.text, { color: textColor }]} // Add text color
      mode={mode}
      buttonColor={buttonColor}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    paddingVertical: 2,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 26,
  },
});
