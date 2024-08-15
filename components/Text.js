import React from "react";
import { Text as PaperText } from "react-native-paper";
import { StyleSheet } from "react-native";

export default function Text({ style, ...props }) {
  return <PaperText style={[styles.text, style]} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: "400",
    color: "#180161",
  },
});
