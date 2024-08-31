import React from "react";
import { FAB as PaperFAB } from "react-native-paper";
import { StyleSheet } from "react-native";
import { theme } from "../core/theme"; // Import your theme

export default function CustomFAB({ mode, style, ...props }) {
  // Determine the background color based on the mode and theme
  const fabColor = (() => {
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
        return "#000000"; // Default color
    }
  })();

  // Determine the label color based on the mode
  const textColor = (() => {
    switch (mode) {
      case "contained":
        return "#ffffff"; // White text for contained mode
      case "elevated":
        return "#000000"; // Black text for elevated mode
      default:
        return "#000000"; // Default label color
    }
  })();

  return (
    <PaperFAB
      style={[styles.fab, { backgroundColor: fabColor }, style]}
      labelStyle={[styles.label, { color: textColor }]} // Set label color
      mode={mode}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    marginVertical: 10,
    justifyContent: "center",
    width: "50%",
    borderRadius: 30, // Custom border radius for FAB
    height: 50,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
  },
});
