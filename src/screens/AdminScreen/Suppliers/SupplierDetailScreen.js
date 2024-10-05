import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons"; // Icon for default profile
import * as ImagePicker from "expo-image-picker"; // For image picking
import { launchCameraAsync } from "expo-image-picker"; // For camera usage

const SupplierDetailScreen = ({ route }) => {
  const { supplierId } = route.params;
  const [supplier, setSupplier] = useState(null);
  const [editMode, setEditMode] = useState(false); // Toggle edit mode
  const [updatedSupplier, setUpdatedSupplier] = useState({});
  const [selectedImage, setSelectedImage] = useState(null); // For storing the selected image

  useEffect(() => {
    const fetchSupplier = async () => {
      const db = getFirestore();
      const supplierDoc = doc(db, "names", supplierId);
      const supplierSnap = await getDoc(supplierDoc);
      if (supplierSnap.exists()) {
        setSupplier(supplierSnap.data());
        setUpdatedSupplier(supplierSnap.data()); // Initialize updatedSupplier with current data
      }
    };
    fetchSupplier();
  }, [supplierId]);

  // Handle saving updated data
  const handleSave = async () => {
    try {
      const db = getFirestore();
      const supplierRef = doc(db, "suppliers", supplierId);
      await updateDoc(supplierRef, updatedSupplier); // Update Firestore with new data
      Alert.alert("Success", "Supplier information updated successfully.");
      setEditMode(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update supplier information.");
    }
  };

  // Handle image picking
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri); // Set the selected image
      setUpdatedSupplier({ ...updatedSupplier, imageUrl: result.uri }); // Update the image in the state
    }
  };

  // Handle camera for taking profile picture
  const takePicture = async () => {
    let result = await launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri); // Set the selected image
      setUpdatedSupplier({ ...updatedSupplier, imageUrl: result.uri }); // Update the image in the state
    }
  };

  if (!supplier) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={editMode ? pickImage : null}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.profileImage}
            />
          ) : supplier.imageUrl ? (
            <Image
              source={{ uri: supplier.imageUrl }}
              style={styles.profileImage}
            />
          ) : (
            <FontAwesome name="user-circle" size={100} color="#ccc" />
          )}
        </TouchableOpacity>

        {editMode && (
          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
              <Text>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.libraryButton} onPress={pickImage}>
              <Text>Library</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.profileInfo}>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={updatedSupplier.nameDetail}
              onChangeText={(text) =>
                setUpdatedSupplier({ ...updatedSupplier, nameDetail: text })
              }
            />
          ) : (
            <Text style={styles.name}>{supplier.nameDetail}</Text>
          )}

          <Text style={styles.phone}>
            Утас:
            {editMode ? (
              <TextInput
                style={styles.input}
                value={updatedSupplier.phoneNumber}
                onChangeText={(text) =>
                  setUpdatedSupplier({ ...updatedSupplier, phoneNumber: text })
                }
              />
            ) : (
              supplier.phoneNumber || "Мэдээлэл байхгүй"
            )}
          </Text>

          <Text style={styles.additionalInfo}>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={updatedSupplier.additionalInfo}
                onChangeText={(text) =>
                  setUpdatedSupplier({
                    ...updatedSupplier,
                    additionalInfo: text,
                  })
                }
              />
            ) : (
              supplier.additionalInfo || "Нэмэлт мэдээлэл байхгүй"
            )}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Financial Section */}
      <View style={styles.financeSection}>
        <Text style={styles.sectionTitle}>Тооцоо:</Text>
        <Text style={styles.financeText}>
          Нийт авсан гутал:{"    "}
          {editMode ? (
            <TextInput
              style={styles.input}
              value={String(updatedSupplier.totalShoes)}
              onChangeText={(text) =>
                setUpdatedSupplier({
                  ...updatedSupplier,
                  totalShoes: parseInt(text),
                })
              }
              keyboardType="numeric"
            />
          ) : (
            supplier.totalShoes || 0
          )}
        </Text>
        <Text style={styles.financeText}>
          Үлдэгдэл төлбөр:{"    "}
          {editMode ? (
            <TextInput
              style={styles.input}
              value={String(updatedSupplier.balance)}
              onChangeText={(text) =>
                setUpdatedSupplier({
                  ...updatedSupplier,
                  balance: parseFloat(text),
                })
              }
              keyboardType="numeric"
            />
          ) : (
            supplier.balance || 0
          )}
        </Text>
      </View>

      {/* Save or Edit Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={editMode ? handleSave : () => setEditMode(true)}
      >
        <Text style={styles.editButtonText}>
          {editMode ? "Хадгалах" : "Мэдээлэл засах"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFF",
    flexGrow: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  imageButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  cameraButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: "#03A9F4",
    borderRadius: 5,
  },
  libraryButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  profileInfo: {
    flexDirection: "column",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 12,
  },
  phone: {
    fontSize: 17,
    color: "#666",
    marginBottom: 4,
  },
  additionalInfo: {
    fontSize: 17,
    color: "#666",
  },
  input: {
    fontSize: 16,
    color: "#333",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 20,
  },
  financeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  financeText: {
    fontSize: 17,
    color: "#333",
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: "#03A9F4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  editButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SupplierDetailScreen;
