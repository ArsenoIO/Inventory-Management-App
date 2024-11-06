import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import useUserData from "../hooks/useUserData";

const { width, height } = Dimensions.get("window");

const BranchScreen = () => {
  const { userData, loading, error } = useUserData();
  const navigation = useNavigation();
  const [branchData, setBranchData] = useState([]);

  useEffect(() => {
    const fetchBranchData = async () => {
      if (!userData) return;

      const db = getFirestore();
      const branchesCollection = collection(db, "branches");

      try {
        if (userData.branch === "БҮХ САЛБАР") {
          const querySnapshot = await getDocs(branchesCollection);
          const allBranches = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBranchData(allBranches);
        } else {
          const querySnapshot = await getDocs(
            query(
              branchesCollection,
              where("branchName", "==", userData.branch)
            )
          );
          if (!querySnapshot.empty) {
            const branchData = querySnapshot.docs[0].data();
            setBranchData([{ id: querySnapshot.docs[0].id, ...branchData }]);
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
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!userData) {
    return <Text>Хэрэглэгчийн мэдээлэл олдсонгүй.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <View style={styles.iconAndTitle}>
          <Icon
            name="shop"
            size={width * 0.06}
            color="red"
            style={styles.icon}
          />
          <Text style={styles.sectionTitle}>
            {userData.branch === "БҮХ САЛБАР"
              ? "Бүх салбарууд"
              : "Бүртгэлтэй салбар"}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {branchData.map((branch) => (
            <TouchableOpacity
              key={branch.id}
              style={[
                styles.button,
                {
                  backgroundColor:
                    branch.branchName === "ТӨВ САЛБАР"
                      ? "#FF8A65"
                      : branch.branchName === "ӨВӨРХАНГАЙ САЛБАР"
                      ? "#4CAF50"
                      : "#03A9F4",
                },
              ]}
              onPress={() =>
                navigation.navigate("BranchDetailScreen", {
                  branchId: branch.id,
                })
              }
              activeOpacity={0.7}
            >
              <Text style={styles.branchName}>{branch.branchName}</Text>
              <Text style={styles.shoeCount}>{branch.totalShoe}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.05,
    backgroundColor: "#F5F5F5",
  },
  iconAndTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  section: {
    marginBottom: height * 0.05,
  },
  sectionTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    width: "90%",
    paddingVertical: height * 0.025,
    borderRadius: width * 0.04,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: height * 0.015,
  },
  branchName: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingLeft: width * 0.05,
  },
  shoeCount: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingRight: width * 0.05,
  },
});

export default BranchScreen;
