import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

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

      {/* Үүсгэсэн болон Дэлгэрэнгүй товчийг нэг мөрөнд байрлуулах */}
      <View style={styles.footer}>
        <Text style={styles.createdBy}>Үүсгэсэн: {createdBy}</Text>

        {/* Дэлгэрэнгүй товч */}
        <TouchableOpacity style={styles.detailButton} onPress={onDetailPress}>
          <Text style={styles.detailButtonText}>Дэлгэрэнгүй</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.isReviewed}>Төлөв: {isReviewed}</Text>
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
    marginTop: 10,
  },
  createdBy: {
    fontSize: 12,
    color: "#6A9C89",
  },
  detailButton: {
    backgroundColor: "#F56C6C", // Улаан өнгө
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  detailButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  isReviewed: {
    alignSelf: "center",
  },
});

export default SalesReportItem;
