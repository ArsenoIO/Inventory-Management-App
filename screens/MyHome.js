import React, { useState, useEffect } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { firestore } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

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
            const { totalSales } = doc.data();
            const date = doc.id.substring(9); // Баримтын ID-аас он сар өдөр авах
            const formattedDate = `${date.substring(4, 6)}/${date.substring(
              6,
              8
            )}`; // Сар/Өдөр
            return { date: formattedDate, sales: totalSales };
          });

        // Хэвтээ тэнхлэгийн утга (сар/өдөр)
        const labels = filteredData.map((item) => item.date);
        // Босоо тэнхлэгийн утга (борлуулалтын тоо)
        const data = filteredData.map((item) => item.sales);

        setSalesData({
          labels: labels,
          datasets: [{ data: data }],
        });
      } catch (error) {
        console.error("Error fetching sales data: ", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <View style={styles.container}>
      <BarChart
        data={salesData}
        width={Dimensions.get("window").width - 30} // Графикийн өргөн
        height={250}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: "#D3D3D3",
          backgroundGradientFrom: "#2f4F4F",
          backgroundGradientTo: "#2f4F4F",
          decimalPlaces: 0, // утга харагдах байдлыг тохируулах
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 2,
          borderRadius: 10,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});

export default HomeScreen;
