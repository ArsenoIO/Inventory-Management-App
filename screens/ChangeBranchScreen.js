import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const SuppliersInfoScreen = () => {
  return (
    <View>
      <Text style={styles.title}>Тун удахгүй...</Text>
    </View>
  );
};

export default SuppliersInfoScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#CE5A67",
    alignSelf: "center",
  },
});
