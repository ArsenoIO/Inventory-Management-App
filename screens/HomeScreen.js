// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import BranchButton from "../components/BranchButton";
import { Divider } from "react-native-paper";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const HomeScreen = () => {
  const [branchData, setBranchData] = useState({
    tuvSalbar: { totalShoe: 0 },
    uvurkhangaiSalbar: { totalShoe: 0 },
    bumbugurSalbar: { totalShoe: 0 },
  });

  useEffect(() => {
    const fetchBranchData = async () => {
      const db = getFirestore();

      // Төв салбарын мэдээлэл
      const tuvSalbarDoc = await getDoc(doc(db, "branches", "tuvSalbar"));
      const tuvSalbarData = tuvSalbarDoc.exists() ? tuvSalbarDoc.data() : {};

      // Өвөрхангай салбарын мэдээлэл
      const uvurkhangaiSalbarDoc = await getDoc(
        doc(db, "branches", "uvSalbar")
      );
      const uvurkhangaiSalbarData = uvurkhangaiSalbarDoc.exists()
        ? uvurkhangaiSalbarDoc.data()
        : {};

      // Бөмбөгөр салбарын мэдээлэл
      const bumbugurSalbarDoc = await getDoc(
        doc(db, "branches", "bumbugurSalbar")
      );
      const bumbugurSalbarData = bumbugurSalbarDoc.exists()
        ? bumbugurSalbarDoc.data()
        : {};

      setBranchData({
        tuvSalbar: tuvSalbarData,
        uvurkhangaiSalbar: uvurkhangaiSalbarData,
        bumbugurSalbar: bumbugurSalbarData,
      });
    };

    fetchBranchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Сайн байна уу?, Доржоо</Text>
      <Divider style={styles.divider} />
      <View style={styles.section}>
        <View style={styles.iconAndTitle}>
          <Icon name="shop" size={30} color="red" style={styles.icon} />
          <Text style={styles.sectionTitle}>Бүртгэлтэй салбарууд</Text>
        </View>
        <View style={styles.buttonContainer}>
          <BranchButton
            branchName="ТӨВ САЛБАР"
            shoeCount={branchData.tuvSalbar.totalShoe || 0}
            branchScreen="CentralBranch"
            bgColor="#FF8A65"
          />
          <BranchButton
            branchName="ӨВӨРХАНГАЙ"
            shoeCount={branchData.uvurkhangaiSalbar.totalShoe || 0}
            branchScreen="UvurkhangaiBranch"
            bgColor="#4CAF50"
          />
          <BranchButton
            branchName="БӨМБӨГӨР"
            shoeCount={branchData.bumbugurSalbar.totalShoe || 0}
            branchScreen="BumbugurBranch"
            bgColor="#03A9F4"
          />
        </View>
      </View>
      <Divider style={styles.divider} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    marginTop: "10%",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  iconAndTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    marginVertical: 5,
  },
  icon: {
    marginRight: 10,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default HomeScreen;
