// components/BranchChart.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const CHART_HEIGHT = 200;
const CHART_WIDTH = Dimensions.get("window").width - 40; // Дэлгэцийн хэмжээгээр өргөнийг тааруулж байна

const BranchChart = ({ branchName }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const firestore = getFirestore();
        const shoesRef = collection(firestore, "shoes");

        let q;
        if (Array.isArray(branchName)) {
          q = query(shoesRef, where("isSold", "==", false));
        } else {
          q = query(
            shoesRef,
            where("addedBranch", "==", branchName),
            where("isSold", "==", false)
          );
        }

        const querySnapshot = await getDocs(q);

        const labels = [
          "650000-850000",
          "850001-1050000",
          "1050001-1250000",
          "1250001-1450000",
          "1450001-1850000",
        ];
        const priceRanges = {
          "650000-850000": 0,
          "850001-1050000": 0,
          "1050001-1250000": 0,
          "1250001-1450000": 0,
          "1450001-1850000": 0,
        };

        querySnapshot.forEach((doc) => {
          const price = doc.data().shoePrice;
          if (price <= 850000) priceRanges["650000-850000"]++;
          else if (price <= 1050000) priceRanges["850001-1050000"]++;
          else if (price <= 1250000) priceRanges["1050001-1250000"]++;
          else if (price <= 1450000) priceRanges["1250001-1450000"]++;
          else if (price <= 1850000) priceRanges["1450001-1850000"]++;
        });

        console.log("Price Ranges:", priceRanges); // Татаж авсан өгөгдлөө шалгаж байна

        setChartData({
          labels,
          datasets: [{ data: Object.values(priceRanges) }],
        });
      } catch (error) {
        console.error("Алдаа гарлаа:", error);
      }
    };

    fetchPriceData();
  }, [branchName]);

  const chartConfig = {
    backgroundGradientFrom: "#343131",
    backgroundGradientTo: "#343131",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: {
      r: "5",
      strokeWidth: "1",
      stroke: "#000",
    },
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        chartConfig={chartConfig}
        bezier
        style={styles.chartStyle}
        withHorizontalLabels={true}
        withVerticalLabels={true}
        fromZero={true} // Хэмжээсийн эхлэл
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  chartStyle: {
    marginLeft: 10,
  },
});

export default BranchChart;
