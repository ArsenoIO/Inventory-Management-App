import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const LeasingScreen = () => {
  return (
    <View>
      <Text style={styles.title}>LeasingScreen</Text>
    </View>
  );
};

export default LeasingScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#CE5A67",
    alignSelf: "center",
  },
});
