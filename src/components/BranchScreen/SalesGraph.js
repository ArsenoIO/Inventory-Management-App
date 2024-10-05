import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  VictoryChart,
  VictoryTheme,
  VictoryBar,
  VictoryAxis,
} from "victory-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import VictoryLineChart from "./VictoryLineChart"; // Import the reusable component

const SalesGraph = ({ branchId }) => {
  const [interval, setInterval] = useState(7); // Default to 7 days
  const [totalIncomeData, setTotalIncomeData] = useState([]);
  const [totalSalesData, setTotalSalesData] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);

  const [totalIncome, setTotalIncome] = useState(0); // State to store total income
  const [totalSales, setTotalSales] = useState(0); // State to store total sales

  useEffect(() => {
    const fetchBranchName = async (branchId) => {
      const db = getFirestore();
      try {
        const branchRef = doc(db, "branches", branchId);
        const branchSnap = await getDoc(branchRef);
        if (branchSnap.exists()) {
          const branchData = branchSnap.data();
          return branchData.branchName;
        } else {
          console.log("Branch not found.");
          return null;
        }
      } catch (error) {
        console.error("Error fetching branch name:", error);
      }
    };

    const fetchSalesData = async () => {
      const db = getFirestore();
      const salesCollection = collection(db, "salesReport");
      const startDate = Timestamp.fromDate(
        new Date(Date.now() - interval * 24 * 60 * 60 * 1000)
      );
      const branchName = await fetchBranchName(branchId);

      try {
        const q = query(
          salesCollection,
          where("branch", "==", branchName),
          where("date", ">", startDate)
        );
        const querySnapshot = await getDocs(q);
        let incomeData = [];
        let salesData = [];
        let totalIncomeCalc = 0;
        let totalSalesCalc = 0;

        let paymentData = {
          Storepay: 0,
          Pocket: 0,
          LendPay: 0,
          Leasing: 0,
          Cash: 0,
        };

        querySnapshot.forEach((doc) => {
          const report = doc.data();
          incomeData.push({
            date: report.date.toDate(), // Keep this as a Date object
            totalIncome: report.totalIncome,
          });
          salesData.push({
            date: report.date.toDate(), // Keep this as a Date object
            totalSales: report.totalSales,
          });
          totalIncomeCalc += report.totalIncome;
          totalSalesCalc += report.totalSales;
        });

        setTotalIncomeData(incomeData);
        setTotalIncome(totalIncomeCalc); // Set total income
        setTotalSales(totalSalesCalc); // Set total sales

        setTotalSalesData(salesData);
        setPaymentMethodData([
          { method: "Storepay", count: paymentData.Storepay },
          { method: "Pocket", count: paymentData.Pocket },
          { method: "LendPay", count: paymentData.LendPay },
          { method: "Leasing", count: paymentData.Leasing },
          { method: "Cash", count: paymentData.Cash },
        ]);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, [interval, branchId]);
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setInterval(7)}>
          <Text style={styles.buttonText}>7 хоног</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setInterval(14)}>
          <Text style={styles.buttonText}>14 хоног</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setInterval(28)}>
          <Text style={styles.buttonText}>28 хоног</Text>
        </TouchableOpacity>
      </View>

      {/* Orlogiin uzuulelt with total display */}
      <View style={styles.chartRow}>
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Орлогын үзүүлэлт ({interval} хоног)</Text>
          {totalIncomeData.length > 0 ? (
            <VictoryChart theme={VictoryTheme.material}>
              <VictoryLineChart
                data={totalIncomeData}
                x="date"
                y="totalIncome"
                color="#023047"
              />
            </VictoryChart>
          ) : (
            <Text>Орлогын мэдээлэл байхгүй байна</Text>
          )}
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>
            Нийт орлого:
            <Text style={styles.totalValue}> {totalIncome}₮</Text>
          </Text>
        </View>
      </View>

      {/* Borluulsan too with total display */}
      <View style={styles.chartRow}>
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Борлуулсан тоо ({interval} хоног)</Text>
          {totalSalesData.length > 0 ? (
            <VictoryChart theme={VictoryTheme.material}>
              <VictoryLineChart
                data={totalSalesData}
                x="date"
                y="totalSales"
                color="#fb8500"
              />
            </VictoryChart>
          ) : (
            <Text>Борлуулалтын мэдээлэл байхгүй байна</Text>
          )}
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>
            Нийт борлуулсан тоо:
            <Text style={styles.totalValue}> {totalSales}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#fb8500",
    borderRadius: 3,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartRow: {
    // Align chart and total text side by side
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  chartContainer: {
    flex: 3,
  },
  totalContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fb8500",
  },
});

export default SalesGraph;
