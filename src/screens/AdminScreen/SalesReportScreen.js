import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const SalesReportScreen = () => {
  return (
    <View>
      <Text style={styles.title}>SalesReportScreen</Text>
    </View>
  );
};

export default SalesReportScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#CE5A67",
    alignSelf: "center",
  },
});
