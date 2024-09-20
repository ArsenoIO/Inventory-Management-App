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

const SizeDistributionChart = ({ branchName }) => {
  const [sizeData, setSizeData] = useState([]);

  useEffect(() => {
    const fetchSizeData = async () => {
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

      const sizeRanges = {
        34: 0,
        35: 0,
        36: 0,
        37: 0,
        38: 0,
        39: 0,
        40: 0,
        41: 0,
        42: 0,
        43: 0,
        44: 0,
        45: 0,
      };

      querySnapshot.forEach((doc) => {
        const size = doc.data().shoeSize;
        if (sizeRanges[size] !== undefined) {
          sizeRanges[size]++;
        }
      });

      const chartData = Object.keys(sizeRanges).map((size) => ({
        name: size,
        population: sizeRanges[size],
        color: getRandomColor(),
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      }));

      setSizeData(chartData);
    };

    fetchSizeData();
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
        data={sizeData}
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

export default SizeDistributionChart;
