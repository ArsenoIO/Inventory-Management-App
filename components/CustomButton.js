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
        return "#2F4F4F"; // Lighter blue for text
        case "exit":
          return "#973131";
      default:
        return undefined; // Default color
    }
  })();

  return (
    <PaperButton
      style={[styles.button, style]}
      labelStyle={styles.text}
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
