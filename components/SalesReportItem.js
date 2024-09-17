// components/SalesReportItem.js

import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const SalesReportItem = ({
  branch,
  date,
  income,
  totalSales,
  expenses,
  createdBy,
  isReviewed,
  onDetailPress,
}) => {
  return (
    <View style={styles.reportContainer}>
      <View style={styles.header}>
        <Text style={styles.branch}>{branch}</Text>
        <Text style={styles.date}>Тайлан: {date}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.income}>
          Орлого: <Text style={styles.incomeValue}>{income}₮</Text>
        </Text>
        <Text style={styles.totalSales}>Зарагдсан гутал: {totalSales}</Text>
        <Text style={styles.expenses}>
          Бусад зардал: <Text style={styles.expensesValue}>{expenses}₮</Text>
        </Text>
      </View>
      <Text style={styles.createdBy}>Илгээсэн: {createdBy}</Text>
      <Button title="Дэлгэрэнгүй" color="#03A9F4" onPress={onDetailPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  reportContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: "#F4BF96",
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  branch: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  body: {
    marginBottom: 10,
  },
  income: {
    fontSize: 14,
    color: "#000",
  },
  incomeValue: {
    color: "green",
  },
  totalSales: {
    fontSize: 14,
    color: "#000",
  },
  expenses: {
    fontSize: 14,
    color: "#000",
  },
  expensesValue: {
    color: "red",
  },
  createdBy: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
});

export default SalesReportItem;
