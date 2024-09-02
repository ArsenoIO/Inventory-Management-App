import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import BranchName from "../components/BranchName";
import { firestore, auth } from "../firebaseConfig";
import TotalRegisteredShoes from "../components/TotalRegisteredShoes";
import PriceDistributionChart from "../components/PriceDistributionChart";
import SizeDistributionChart from "../components/SizeDistributionChart";
import TotalSoldShoes from "../components/TotalSoldShoes";
import PaymentMethodChart from "../components/PaymentMethodChart";
import SoldSizeDistributionChart from "../components/SoldSizeDistributionChart";
import { Divider } from "react-native-paper";

const HomeScreen = () => {
  const [branchName, setBranchName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allBranches, setAllBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(userData.userRole === "admin");

            if (userData.userRole === "admin") {
              // Admin can see all branches
              const branchesSnapshot = await getDocs(
                collection(firestore, "branches")
              );
              const branches = branchesSnapshot.docs.map(
                (doc) => doc.data().branchName
              );
              setAllBranches(branches);
            } else {
              // Normal user sees only their branch
              setBranchName(userData.branch);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isAdmin ? (
        allBranches.map((branch) => (
          <View key={branch}>
            <BranchName branchName={branch} />
            <Divider style={styles.divider} />
            <TotalRegisteredShoes branchName={branch} />
            <PriceDistributionChart branchName={branch} />
            <SizeDistributionChart branchName={branch} />
            <TotalSoldShoes branchName={branch} />
            <PaymentMethodChart branchName={branch} />
            <SoldSizeDistributionChart branchName={branch} />
            <Divider style={styles.divider} />
          </View>
        ))
      ) : (
        <>
          <BranchName branchName={branchName} />
          <Divider style={styles.divider} />
          <TotalRegisteredShoes branchName={branchName} />
          <PriceDistributionChart branchName={branchName} />
          <SizeDistributionChart branchName={branchName} />
          <TotalSoldShoes branchName={branchName} />
          <PaymentMethodChart branchName={branchName} />
          <SoldSizeDistributionChart branchName={branchName} />
          <Divider style={styles.divider} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    marginTop: "10%",
  },
  divider: {
    marginVertical: 5,
  },
});

export default HomeScreen;
