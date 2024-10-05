import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ShoeHeader = ({ totalShoes, mostSoldSize, mostStockSize }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.label}>Бүртгэлтэй гутал:</Text>
        <Text style={styles.bigNumber}>{totalShoes}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.rightSection}>
        <Text style={styles.smallLabel}>Хамгийн олон зарагдсан размер:</Text>
        <Text style={styles.rightText}>{mostSoldSize}</Text>
        <Text style={styles.smallLabel}>Хамгийн олон байгаа размер:</Text>
        <Text style={styles.rightText}>{mostStockSize}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  leftSection: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#888",
  },
  bigNumber: {
    fontSize: 48,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: "#888",
  },
  rightSection: {
    flex: 1,
    paddingLeft: 16,
  },
  smallLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  rightText: {
    fontSize: 36,
    color: "#4CAF50",
    fontWeight: "bold",
  },
});

export default ShoeHeader;
