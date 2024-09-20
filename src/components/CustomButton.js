import React from "react";
import { Button as PaperButton } from "react-native-paper";
import { StyleSheet } from "react-native";
import { theme } from "../../core/theme"; // Import your theme

export default function CustomButton({ mode, style, ...props }) {
  // Determine the color based on the mode and theme
  const buttonColor = (() => {
    switch (mode) {
      case "outlined":
        return theme.colors.main; // Use main color for outlined
      case "contained":
        return theme.colors.secondary; // Use secondary color for contained
      case "elevated":
        return theme.colors.surface; // Use surface color for elevated
      case "text":
        return "transparent"; // Transparent for text mode
      case "exit":
        return theme.colors.error; // Use error color for exit
      default:
        return undefined; // Default color
    }
  })();

  // Determine the text color based on the mode and theme
  const textColor = (() => {
    switch (mode) {
      case "contained":
        return "#ffffff"; // White text for contained mode
      case "elevated":
        return "#000000"; // Black text for elevated mode
      case "text":
        return theme.colors.text; // Default text color for text mode
      case "exit":
        return theme.colors.surface; // Use surface color for exit text
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
    width: "100%",
    borderRadius: 10,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 26,
  },
});
