import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const PriceDistributionChart = ({ branchName }) => {
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    const fetchPriceData = async () => {
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

      const chartData = Object.keys(priceRanges).map((range) => ({
        name: range,
        population: priceRanges[range],
        color: getRandomColor(),
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      }));

      setPriceData(chartData);
    };

    fetchPriceData();
  }, [branchName]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <View style={styles.container}>
      <PieChart
        data={priceData}
        width={320}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
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
});

export default PriceDistributionChart;
