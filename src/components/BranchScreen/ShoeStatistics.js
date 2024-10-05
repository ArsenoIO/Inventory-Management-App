import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import CustomBarChart from "./CustomBarChart"; // Import the custom chart component

const ShoeStatistics = ({ branchId }) => {
  const [shoeData, setShoeData] = useState(null);

  // Firestore-оос size болон price статистик татах функц
  const fetchShoeData = async () => {
    const db = getFirestore();
    const docRef = doc(db, "shoeStatistics", branchId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setShoeData(docSnap.data());
    } else {
      console.log("Өгөгдөл олдсонгүй.");
    }
  };

  useEffect(() => {
    fetchShoeData();
  }, [branchId]);

  if (!shoeData) return <Text>Өгөгдөл ачааллаж байна...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Размераар:</Text>
      <CustomBarChart
        data={shoeData.sizeStats}
        xField="size"
        yField="count"
        labelFormatter={({ datum }) =>
          `Размер: ${datum.size}\nТоо: ${datum.count}`
        }
        horizontal
      />

      <Text style={styles.title}>Үнийн дүнгээр:</Text>
      <CustomBarChart
        data={shoeData.priceStats}
        xField="priceRange"
        yField="count"
        labelFormatter={({ datum }) => `${datum.priceRange}\n${datum.count}`}
        horizontal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ShoeStatistics;
