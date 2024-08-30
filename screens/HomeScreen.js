import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { firestore } from "../firebaseConfig"; // Firebase холболтын тохиргоо
import { collection, query, where, getDocs } from "firebase/firestore";

const HomeScreen = () => {
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const salesRef = collection(firestore, "sales");
        const querySnapshot = await getDocs(salesRef);
        const filteredData = querySnapshot.docs
          .filter((doc) => {
            const { soldShoesList } = doc.data();
            return soldShoesList.some(
              (shoe) => shoe.addedBranch === "ТӨВ САЛБАР"
            );
          })
          .map((doc) => {
            const { totalSales, totalAmount } = doc.data();
            const date = doc.id.substring(9); // Баримтын ID-аас он сар өдөр авах
            console.log(date);
            return {
              x: `${date.substring(4, 6)}/${date.substring(6, 8)}`, // Сар/Өдөр
              y: totalSales, // Нийт борлуулалтын тоо
              amount: totalAmount, // Нийт орлого
            };
          });
        console.log(filteredData);
        setSalesData(filteredData);
      } catch (error) {
        console.error("Error fetching sales data: ", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <View style={styles.container}>
      {salesData.map((item, index) => (
        <View key={index}>
          <Text>Огноо: {item.date}</Text>
          <Text>Нийт борлуулалт: {item.totalSales}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
  },
});

export default HomeScreen;
