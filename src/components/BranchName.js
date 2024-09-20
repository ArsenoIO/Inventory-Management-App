import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BranchName = ({ branchName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.branchName}>{branchName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#14213d",
  },
  branchName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default BranchName;
