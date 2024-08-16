// CustomTextInput.js
import React from "react";
import { TextInput as PaperTextInput } from "react-native-paper";
import { StyleSheet } from "react-native";

const MyPaperTextInput = (props) => {
  const { style, ...rest } = props;

  return <PaperTextInput {...rest} mode="flat" style={[styles.input, style]} />;
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "transparent",
    borderRadius: 10,
    width: 100,
  },
});

export default MyPaperTextInput;
