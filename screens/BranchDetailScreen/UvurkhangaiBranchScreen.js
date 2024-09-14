// screens/BranchDetailScreen/CentralBranchScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ShoeSizeBarChart from "../../components/Charts/ShoeSizeBarChart"; // Гутлын хэмжээний баганан графикийг импортолж байна
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const UwurkhangaiBranchScreen = () => {
  const [totalShoes, setTotalShoes] = useState(0);
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const firestore = getFirestore();

      // Бүртгэлтэй гутлын тоог авах
      const shoesRef = collection(firestore, "shoes");
      const shoesQuery = query(
        shoesRef,
        where("addedBranch", "==", "ӨВӨРХАНГАЙ САЛБАР")
      );
      const shoesSnapshot = await getDocs(shoesQuery);
      setTotalShoes(shoesSnapshot.size); // Нийт бүртгэлтэй гутлын тоо

      // Худалдагчдын нэрсийг авах
      const sellersRef = collection(firestore, "users");
      const sellersQuery = query(
        sellersRef,
        where("branch", "==", "ӨВӨРХАНГАЙ САЛБАР")
      );
      const sellersSnapshot = await getDocs(sellersQuery);
      const sellerNames = sellersSnapshot.docs.map(
        (doc) => doc.data().userName
      );
      setSellers(sellerNames); // Худалдагчдын нэрс
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        {/* Нийт бүртгэлтэй гутлын тоо */}
        <Text style={styles.labelText}>Нийт бүртгэлтэй гутал:</Text>
        <Text style={styles.valueText}>{totalShoes}</Text>
      </View>

      <View style={styles.rowContainer}>
        {/* Худалдагчдын нэрс */}
        <Text style={styles.labelText}>Худалдагчид:</Text>
        <View style={styles.sellerNamesContainer}>
          {sellers.length > 0 ? (
            sellers.map((seller, index) => (
              <Text key={index} style={styles.valueText}>
                {seller}
              </Text>
            ))
          ) : (
            <Text style={styles.valueText}>Худалдагч олдсонгүй</Text>
          )}
        </View>
      </View>

      {/* Гутлын хэмжээний баганан график */}
      <ShoeSizeBarChart branchName="ӨВӨРХАНГАЙ САЛБАР" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "top",
    alignItems: "center",
    backgroundColor: "#FFFBFF",
    padding: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  labelText: {
    fontSize: 18, // Том фонт
    fontWeight: "bold",
    color: "#333", // Зөөлөн бараан өнгө
  },
  valueText: {
    fontSize: 18, // Том фонт
    fontWeight: "bold",
    color: "#185519", // Хөгжүүлсэн цэнхэр өнгө
  },
  sellerNamesContainer: {
    alignItems: "flex-end", // Худалдагчдын нэрсийг баруун талд эгнэж харагдуулна
  },
});

export default UwurkhangaiBranchScreen;
