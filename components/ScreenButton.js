import React from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton, useTheme } from "react-native-paper";

export default function ScreenButton({ mode, style, ...props }) {
  const { colors } = useTheme();

  return (
    <PaperButton
      style={[
        styles.button,
        mode === "contained" && { backgroundColor: colors.primary },
        mode === "outlined" && {
          borderColor: colors.secondary,
          borderWidth: 1,
        },
        style,
      ]}
      labelStyle={[styles.text, { color: colors.text }]}
      mode={mode}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    paddingVertical: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
