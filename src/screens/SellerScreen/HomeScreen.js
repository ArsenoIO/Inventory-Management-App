import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import BranchButton from "../../components/BranchButton";
import { Divider } from "react-native-paper";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import useUserData from "../../hooks/useUserData"; // Import the custom hook

const HomeScreen = () => {
  const { userData, loading, error } = useUserData(); // Using the custom hook
  const navigation = useNavigation();
  const [totalShoe, setTotalShoe] = useState(0); // totalShoe-г хадгалах state

  useEffect(() => {
    const fetchTotalShoe = async () => {
      if (!userData?.branch) return; // userData.branch байхгүй бол цааш үргэлжлүүлэхгүй

      const db = getFirestore();
      const branchesCollection = collection(db, "branches");

      // Query хийх: /branches дотроос userData.branch-тэй тохирох branchName-ийг хайна
      const branchQuery = query(
        branchesCollection,
        where("branchName", "==", userData.branch)
      );

      try {
        const querySnapshot = await getDocs(branchQuery);
        if (!querySnapshot.empty) {
          const branchData = querySnapshot.docs[0].data(); // Эхний тохирсон document-ийг авах
          setTotalShoe(branchData.totalShoe); // totalShoe-г state-д оноох
        } else {
          console.log("Салбар олдсонгүй.");
        }
      } catch (error) {
        console.error("Алдаа гарлаа:", error);
      }
    };
    fetchTotalShoe();
  }, [userData]);
  if (loading) {
    return <Text>Loading...</Text>; // You can replace this with a loader component
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  // Dynamically set branch screen based on user's branch
  const getBranchScreen = () => {
    if (userData.branch === "ТӨВ САЛБАР") return "CentralBranchScreen";
    if (userData.branch === "ӨВӨРХАНГАЙ САЛБАР")
      return "UvurkhangaiBranchScreen";
    if (userData.branch === "БӨМБӨГӨР САЛБАР") return "BumbugurBranchScreen";
    return null;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Divider style={styles.divider} />
      <View style={styles.section}>
        <View style={styles.iconAndTitle}>
          <Icon name="shop" size={30} color="red" style={styles.icon} />
          <Text style={styles.sectionTitle}>Бүртгэлтэй салбар</Text>
        </View>
        <View style={styles.buttonContainer}>
          {userData.branch && (
            <BranchButton
              branchName={
                userData.branch === "ТӨВ САЛБАР"
                  ? "ТӨВ САЛБАР"
                  : userData.branch === "ӨВӨРХАНГАЙ САЛБАР"
                  ? "ӨВӨРХАНГАЙ"
                  : "БӨМБӨГӨР САЛБАР"
              }
              shoeCount={totalShoe}
              branchScreen={getBranchScreen()}
              onPress={() => navigation.navigate(getBranchScreen())}
              bgColor={
                userData.branch === "ТӨВ САЛБАР"
                  ? "#FF8A65"
                  : userData.branch === "ӨВӨРХАНГАЙ САЛБАР"
                  ? "#4CAF50"
                  : "#03A9F4"
              }
            />
          )}
        </View>
      </View>
      <Divider style={styles.divider} />
      <Button
        title="Өнөөдрийн гутал бүртгэл"
        onPress={() => navigation.navigate("BvrtgelScreen")}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5F5",
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
