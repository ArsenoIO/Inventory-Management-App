import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import BranchButton from "../../components/BranchButton";
import { Divider } from "react-native-paper";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import useUserData from "../../hooks/useUserData"; // Import the custom hook

const HomeScreen = () => {
  const { userData, loading, error } = useUserData(); // Using the custom hook
  const navigation = useNavigation();
  const [branchData, setBranchData] = useState([]); // Бүх салбаруудыг хадгалах state

  useEffect(() => {
    const fetchBranchData = async () => {
      // Хэрэв userData байхгүй бол логикийг цааш ажиллуулахгүй
      if (!userData) return;

      const db = getFirestore();
      const branchesCollection = collection(db, "branches");

      try {
        if (userData.branch === "БҮХ САЛБАР") {
          // Бүх салбарын мэдээллийг татах
          const querySnapshot = await getDocs(branchesCollection);
          const allBranches = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBranchData(allBranches); // Бүх салбаруудыг state-д хадгалах
        } else {
          // Хэрэглэгчийн салбарын мэдээллийг татах
          const querySnapshot = await getDocs(
            query(
              branchesCollection,
              where("branchName", "==", userData.branch)
            )
          );
          if (!querySnapshot.empty) {
            const branchData = querySnapshot.docs[0].data();
            setBranchData([{ id: querySnapshot.docs[0].id, ...branchData }]); // Тухайн салбарын мэдээллийг state-д хадгалах
          } else {
            console.log("Салбар олдсонгүй.");
          }
        }
      } catch (error) {
        console.error("Алдаа гарлаа:", error);
      }
    };

    fetchBranchData();
  }, [userData]);

  if (loading) {
    return <Text>Loading...</Text>; // You can replace this with a loader component
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!userData) {
    return <Text>Хэрэглэгчийн мэдээлэл олдсонгүй.</Text>;
  }

  // Dynamically set branch screen based on user's branch
  const getBranchScreen = (branchName) => {
    if (branchName === "ТӨВ САЛБАР") return "CentralBranchScreen";
    if (branchName === "ӨВӨРХАНГАЙ САЛБАР") return "UvurkhangaiBranchScreen";
    if (branchName === "БӨМБӨГӨР САЛБАР") return "BumbugurBranchScreen";
    return null;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Divider style={styles.divider} />
      <View style={styles.section}>
        <View style={styles.iconAndTitle}>
          <Icon name="shop" size={30} color="red" style={styles.icon} />
          <Text style={styles.sectionTitle}>
            {userData.branch === "БҮХ САЛБАР"
              ? "Бүх салбарууд"
              : "Бүртгэлтэй салбар"}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {branchData.map((branch) => (
            <BranchButton
              key={branch.id}
              branchName={branch.branchName}
              shoeCount={branch.totalShoe}
              branchScreen={getBranchScreen(branch.branchName)}
              onPress={() =>
                navigation.navigate(getBranchScreen(branch.branchName))
              }
              bgColor={
                branch.branchName === "ТӨВ САЛБАР"
                  ? "#FF8A65"
                  : branch.branchName === "ӨВӨРХАНГАЙ САЛБАР"
                  ? "#4CAF50"
                  : "#03A9F4"
              }
            />
          ))}
        </View>
      </View>
      <Divider style={styles.divider} />
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
