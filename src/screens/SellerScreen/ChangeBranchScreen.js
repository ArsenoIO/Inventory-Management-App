import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
} from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";

const { width, height } = Dimensions.get("window");

const BranchUpdateScreen = () => {
  const [shoeCode, setShoeCode] = useState(""); // For user to enter shoe code
  const [selectedShoe, setSelectedShoe] = useState(null); // To track the selected shoe
  const [branches, setBranches] = useState([]); // To store list of branches fetched from Firestore
  const [selectedBranch, setSelectedBranch] = useState(""); // Selected new branch
  const [loading, setLoading] = useState(false);

  const db = getFirestore();

  useEffect(() => {
    fetchBranches(); // Fetch branches when the component mounts
  }, []);

  const fetchBranches = async () => {
    try {
      const branchesCollection = collection(db, "branches"); // Assuming your branches are stored here
      const branchSnapshot = await getDocs(branchesCollection);
      const branchList = branchSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBranches(branchList);
    } catch (error) {
      console.error("Error fetching branches: ", error);
    }
  };

  const handleSearchShoe = async () => {
    if (!shoeCode) {
      Alert.alert("Please enter a shoe code.");
      return;
    }

    try {
      setLoading(true);
      const shoesCollection = collection(db, "shoes");
      const shoesSnapshot = await getDocs(query(shoesCollection));
      const shoe = shoesSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .find((s) => s.shoeCode === shoeCode);

      if (shoe) {
        setSelectedShoe(shoe);
        setLoading(false);
      } else {
        Alert.alert("No shoe found with that code.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching shoe: ", error);
      setLoading(false);
    }
  };

  const handleBranchChange = async () => {
    if (!selectedShoe || !selectedBranch) {
      Alert.alert("Please select a shoe and a new branch.");
      return;
    }

    try {
      const shoeRef = doc(db, "shoes", selectedShoe.id);
      await updateDoc(shoeRef, {
        addedBranch: selectedBranch,
      });

      Alert.alert("Success", "Branch updated successfully.");
      setSelectedShoe(null); // Reset selection
      setShoeCode(""); // Reset shoe code input
      setSelectedBranch(""); // Reset branch selection
    } catch (error) {
      console.error("Error updating branch: ", error);
      Alert.alert("Error", "Failed to update branch.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Input for Shoe Code */}
      <TextInput
        style={styles.input}
        value={shoeCode}
        onChangeText={setShoeCode}
        placeholder="Гутлын кодоо оруулна уу..."
      />
      <TouchableOpacity onPress={handleSearchShoe} style={styles.searchButton}>
        <Text style={styles.buttonText}>Гутал Хайх</Text>
      </TouchableOpacity>

      {/* Show selected shoe details */}
      {selectedShoe && (
        <View style={styles.shoeDetails}>
          <Text style={styles.shoeInfo}>
            Гутлын Код: {selectedShoe.shoeCode}
          </Text>
          <Text style={styles.shoeInfo}>
            Одоогийн Салбар: {selectedShoe.addedBranch}
          </Text>
        </View>
      )}

      {/* Select Branch */}
      <Text style={styles.label}>Шинэ Салбарыг Сонгох:</Text>
      <Picker
        selectedValue={selectedBranch}
        onValueChange={(itemValue) => setSelectedBranch(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Сонгох..." value="" />
        {branches.map((branch) => (
          <Picker.Item
            key={branch.id}
            label={branch.branchName}
            value={branch.branchName}
          />
        ))}
      </Picker>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleBranchChange}
        style={styles.submitButton}
        disabled={!selectedShoe || !selectedBranch}
      >
        <Text style={styles.buttonText}>Салбарыг Шинэчлэх</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: "#FFF",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  shoeDetails: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  shoeInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BranchUpdateScreen;
