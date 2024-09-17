import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import ProfileButton from "../components/ProfileButton";
import useUserData from "../hooks/useUserData";

const SuppliersInfoScreen = () => {
  const [suppliers, setSuppliers] = useState([]);
  const { userData, loading, error } = useUserData();

  const navigation = useNavigation();

  useEffect(() => {
    if (!loading && userData) {
      if (userData.userRole === "admin") {
        // Fetch suppliers only if the user is an admin
        fetchSuppliers();
      } else {
        // If the user is not an admin, show an alert and go back
        Alert.alert(
          "Хандах эрхгүй",
          "Танд нийлүүлэгчдийн мэдээлэлд хандах эрх байхгүй байна.",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(), // Redirect user back to the previous screen
            },
          ]
        );
      }
    }
  }, [userData, loading]);

  const fetchSuppliers = async () => {
    const db = getFirestore();
    const suppliersCollection = collection(db, "names");
    const supplierSnapshot = await getDocs(suppliersCollection);

    const supplierList = supplierSnapshot.docs.map((doc) => ({
      id: doc.id,
      nameDetail: doc.data().nameDetail,
    }));

    setSuppliers(supplierList);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {suppliers.map((supplier) => (
        <View key={supplier.id} style={styles.buttonContainer}>
          <ProfileButton
            initials={supplier.id}
            name={supplier.nameDetail}
            shoes={0} // Placeholder data for now
            balance={0} // Placeholder data for now
            loan={0} // Placeholder data for now
            onPress={() => {}}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 10,
  },
});

export default SuppliersInfoScreen;
