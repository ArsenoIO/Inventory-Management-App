import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const TotalSoldShoes = ({ branchName }) => {
  const [totalSoldShoes, setTotalSoldShoes] = useState(0);

  useEffect(() => {
    const fetchTotalSoldShoes = async () => {
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
      setTotalSoldShoes(querySnapshot.size);
    };

    fetchTotalSoldShoes();
  }, [branchName]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Нийт зарагдсан гутлын тоо:</Text>
      <Text style={styles.value}>{totalSoldShoes}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    color: "#333",
  },
  value: {
    fontSize: 22,
    color: "red",
    fontWeight: "bold",
  },
});

export default TotalSoldShoes;
