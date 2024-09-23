import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";

// Importing the JSON data
const leasingData = require("../../../leasing.json"); // Make sure this path is correct

const { width } = Dimensions.get("window");

const LeasingTableScreen = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    // Assuming the JSON has a key "Sheet1" which holds the data array
    const jsonData = leasingData.Sheet1;
    setData(jsonData);

    // Extract the keys (column names) from the first item
    if (jsonData.length > 0) {
      const firstItem = jsonData[0];
      const keys = Object.keys(firstItem);
      setColumns(keys);
    }
  }, []);

  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        <Text style={styles.header}>Лизингийн Дэлгэрэнгүй</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          {columns.map((column, index) => (
            <Text key={index} style={styles.tableHeaderText}>
              {column}
            </Text>
          ))}
        </View>

        {/* Table Content */}
        <ScrollView>
          {data.map((item, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {columns.map((column, colIndex) => (
                <Text key={colIndex} style={styles.tableText}>
                  {item[column]}
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFF",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  tableHeaderText: {
    fontWeight: "bold",
    width: width * 0.3, // Adjust width as needed
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableText: {
    width: width * 0.3, // Adjust width as needed
    textAlign: "center",
  },
});

export default LeasingTableScreen;
