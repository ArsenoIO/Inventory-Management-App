import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const TotalRegisteredShoes = ({ branchName }) => {
  const [totalShoes, setTotalShoes] = useState(0);

  useEffect(() => {
    const fetchTotalShoes = async () => {
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
      setTotalShoes(querySnapshot.size);
    };

    fetchTotalShoes();
  }, [branchName]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Нийт бүртгэлтэй гутлын тоо:</Text>
      <Text style={styles.value}>{totalShoes}</Text>
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
    color: "green",
    fontWeight: "bold",
  },
});

export default TotalRegisteredShoes;
