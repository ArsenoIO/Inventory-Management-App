import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput as Input } from "react-native-paper";
import { theme } from "../../core/theme";

export default function TextInput(props) {
  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        activeOutlineColor={theme.colors.text}
        underlineColor="transparent"
        mode="outlined"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
});
