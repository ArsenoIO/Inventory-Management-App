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

const PaymentMethodChart = ({ branchName }) => {
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    const fetchPaymentData = async () => {
      const firestore = getFirestore();
      const shoesRef = collection(firestore, "shoes");

      let q;
      if (Array.isArray(branchName)) {
        q = query(shoesRef, where("isSold", "==", true));
      } else {
        q = query(
          shoesRef,
          where("addedBranch", "==", branchName),
          where("isSold", "==", true)
        );
      }

      const querySnapshot = await getDocs(q);

      const paymentMethods = {
        Storepay: 0,
        Pocket: 0,
        Lend: 0,
        Leasing: 0,
        "Шууд төлөлт": 0,
      };

      querySnapshot.forEach((doc) => {
        const method = doc.data().transactionMethod;
        if (paymentMethods[method] !== undefined) {
          paymentMethods[method]++;
        }
      });

      const chartData = Object.keys(paymentMethods).map((method) => ({
        name: method,
        population: paymentMethods[method],
        color: getRandomColor(),
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      }));

      setPaymentData(chartData);
    };

    fetchPaymentData();
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
        data={paymentData}
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

export default PaymentMethodChart;
