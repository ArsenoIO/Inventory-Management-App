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
import { Divider } from "react-native-paper";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import useUserData from "../hooks/useUserData"; // Import the custom hook

const BranchScreen = () => {
  const { userData, loading, error } = useUserData(); // Using the custom hook
  const navigation = useNavigation();
  const [branchData, setBranchData] = useState([]); // Бүх салбаруудыг хадгалах state
  const { width } = Dimensions.get("window");

  const fetchUnsoldShoeCount = async (branchName) => {
    const db = getFirestore();
    const shoesCollection = collection(db, "shoes");

    try {
      const unsoldShoesQuery = query(
        shoesCollection,
        where("addedBranch", "==", branchName),
        where("isSold", "==", true) // Only unsold shoes
      );

      const unsoldShoesSnapshot = await getDocs(unsoldShoesQuery);
      const unsoldCount = unsoldShoesSnapshot.size;
      console.log(`Зарагдаагүй гутлын тоо (${branchName}): ${unsoldCount}`);
    } catch (error) {
      console.error("Зарагдаагүй гутлын тоог авахад алдаа гарлаа:", error);
    }
  };

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

          // Each branch unsold count
          allBranches.forEach((branch) =>
            fetchUnsoldShoeCount(branch.branchName)
          );
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

            // Fetch unsold count for the specific branch
            fetchUnsoldShoeCount(userData.branch);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <View style={styles.iconAndTitle}>
          <Icon name="shop" size={24} color="red" style={styles.icon} />
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
                  branchId: branch.id, // Салбарын ID-г дамжуулж байна
                })
              }
              activeOpacity={0.7} // Button дарахад opacity буурч харагдана
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
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  iconAndTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center", // Center the buttons
  },
  button: {
    width: "90%", // Adjust the width for a nice centered look
    backgroundColor: "#FFEB3B", // Yellow background
    paddingVertical: 20,
    borderRadius: 15, // Rounded corners
    flexDirection: "row", // Layout items in a row
    justifyContent: "space-between", // Space between title and count
    alignItems: "center", // Center the content vertically
    marginVertical: 10,
  },
  branchName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffff", // Black text for the branch name
    paddingLeft: 20,
  },
  shoeCount: {
    fontSize: 32, // Larger text for the shoe count
    fontWeight: "bold",
    color: "#fff", // Different color for the count (blue)
    paddingRight: 20,
  },
  divider: {
    height: "100%", // Make the divider span the height of the button
    width: 2,
    backgroundColor: "#fff", // White divider line
    marginHorizontal: 10, // Add space around the divider
  },
});

export default BranchScreen;
