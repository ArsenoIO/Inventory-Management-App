import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const SalesReportItem = ({
  branch,
  date,
  income,
  totalSales,
  expenses,
  createdBy,
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

      {/* Үүсгэсэн болон Дэлгэрэнгүй товчийг нэг мөрөнд байрлуулах */}
      <View style={styles.footer}>
        <Text style={styles.createdBy}>Үүсгэсэн: {createdBy}</Text>

        {/* Дэлгэрэнгүй товч */}
        <TouchableOpacity style={styles.detailButton} onPress={onDetailPress}>
          <Text style={styles.detailButtonText}>Дэлгэрэнгүй</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reportContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: "#141E46",
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  branch: {
    fontSize: 20,
    fontWeight: "bold",
  },
  date: {
    fontSize: 15,
    color: "#379777",
  },
  body: {
    padding: 10,
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
  footer: {
    flexDirection: "row", // Үүсгэсэн болон товчийг нэг мөрөнд гаргах
    justifyContent: "space-between", // Товч болон текстийг хоёр талд байрлуулах
    alignItems: "center",
  },
  createdBy: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#379777",
  },
  detailButton: {
    backgroundColor: "#FF6969", // Улаан өнгө
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  detailButtonText: {
    color: "#FFF5E0",
    fontSize: 14,
    fontWeight: "bold",
  },
  isReviewed: {
    alignSelf: "center",
  },
});

export default SalesReportItem;
