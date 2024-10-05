import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import ProfileButton from "../../../components/ProfileButton";
import useUserData from "../../../hooks/useUserData";

const SuppliersInfoScreen = () => {
  const [suppliers, setSuppliers] = useState([]);
  const { userData, loading, error } = useUserData();

  const navigation = useNavigation();

  useEffect(() => {
    fetchSuppliers();
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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddSupplierScreen")}
      >
        <Text style={styles.addButtonText}>Нийлүүлэгч нэмэх</Text>
      </TouchableOpacity>
      {suppliers.map((supplier) => (
        <View key={supplier.id} style={styles.buttonContainer}>
          <ProfileButton
            initials={supplier.id}
            name={supplier.nameDetail}
            shoes={0} // Placeholder data for now
            balance={0} // Placeholder data for now
            loan={0} // Placeholder data for now
            onPress={() =>
              navigation.navigate("SupplierDetailScreen", {
                supplierId: supplier.id,
              })
            }
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
  addButton: {
    backgroundColor: "#03A9F4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SuppliersInfoScreen;
