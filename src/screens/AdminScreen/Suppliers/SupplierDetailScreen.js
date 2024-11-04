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
  Dimensions,
} from "react-native";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

const SupplierDetailScreen = ({ route, navigation }) => {
  const { supplierId } = route.params;
  const [supplier, setSupplier] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedSupplier, setUpdatedSupplier] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const db = getFirestore();
        const supplierDoc = doc(db, "names", supplierId);
        const supplierSnap = await getDoc(supplierDoc);

        if (supplierSnap.exists()) {
          setSupplier(supplierSnap.data());
          setUpdatedSupplier(supplierSnap.data());
        } else {
          console.log("Баримт олдсонгүй.");
          Alert.alert("Анхаар!", "Өгөгдөл олдсонгүй.");
        }
      } catch (error) {
        console.error("Өгөгдлийг татахад алдаа гарлаа:", error);
        Alert.alert("Алдаа", "Өгөгдлийг татахад алдаа гарлаа.");
      }
    };

    fetchSupplier();
  }, [supplierId]);

  const handleHistoryNavigation = () => {
    navigation.navigate("SupplierHistoryScreen", { supplierId });
  };

  const uploadImageToStorage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();
    const storageRef = ref(storage, `names/${supplierId}-${Date.now()}`);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    console.log("Зургийн URL:", downloadURL);
    return downloadURL;
  };

  const handleSave = async () => {
    try {
      const db = getFirestore();
      const supplierRef = doc(db, "names", supplierId);

      const docSnap = await getDoc(supplierRef);
      if (!docSnap.exists()) {
        Alert.alert(
          "Алдаа",
          "Өгөгдлийн санд нийлүүлэгчийн мэдээлэл олдсонгүй."
        );
        return;
      }

      let newImageUrl = updatedSupplier.imageUrl;

      if (selectedImage) {
        newImageUrl = await uploadImageToStorage(selectedImage);
      }

      const newSupplierData = {
        ...updatedSupplier,
        imageUrl: newImageUrl,
      };

      await updateDoc(supplierRef, newSupplierData);
      setSupplier(newSupplierData);
      setUpdatedSupplier(newSupplierData);
      setSelectedImage(null);

      Alert.alert("Амжилттай");
      setEditMode(false);
    } catch (error) {
      Alert.alert("Алдаа", "Нийлүүлэгчийн мэдээллийг шинэчлэхэд алдаа гарлаа.");
      console.log(error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Камер руу хандах зөвшөөрөл хэрэгтэй байна!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  if (!supplier) {
    return <Text style={styles.loadingText}>Татаж байна...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            <FontAwesome name="user-circle" size={width * 0.25} color="#ccc" />
          )}
        </TouchableOpacity>

        {editMode && (
          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
              <Text style={styles.imageButtonText}>Камераар авах</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.libraryButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>Файлаас сонгох</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.profileInfo}>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={updatedSupplier.nameDetail}
            onChangeText={(text) =>
              setUpdatedSupplier({ ...updatedSupplier, nameDetail: text })
            }
            placeholder="Нэр"
          />
        ) : (
          <Text style={styles.name}>{supplier.nameDetail}</Text>
        )}

        <Text style={styles.label}>Утас:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={updatedSupplier.phoneNumber}
            onChangeText={(text) =>
              setUpdatedSupplier({ ...updatedSupplier, phoneNumber: text })
            }
            placeholder="Утасны дугаар"
            keyboardType="phone-pad"
          />
        ) : (
          <Text style={styles.text}>{supplier.phoneNumber || "Хоосон"}</Text>
        )}

        <Text style={styles.label}>Тэмдэглэл:</Text>
        {editMode ? (
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={updatedSupplier.additionalInfo}
            onChangeText={(text) =>
              setUpdatedSupplier({ ...updatedSupplier, additionalInfo: text })
            }
            placeholder="Тэмдэглэл"
            multiline
          />
        ) : (
          <Text style={styles.text}>{supplier.additionalInfo || "Хоосон"}</Text>
        )}
      </View>

      <View style={styles.financeSection}>
        <View style={styles.financeHeader}>
          <Text style={styles.sectionTitle}>Тооцоо:</Text>
          <TouchableOpacity onPress={handleHistoryNavigation}>
            <MaterialIcons name="history" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <Text style={styles.financeText}>
          Нийт авсан гутал:
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
            ` ${supplier.totalShoes || 0}`
          )}
        </Text>
        <Text style={styles.financeText}>
          Үлдэгдэл төлбөр:
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
            ` ${supplier.balance || 0}`
          )}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={editMode ? handleSave : () => setEditMode(true)}
      >
        <Text style={styles.editButtonText}>
          {editMode ? "Хадгалах" : "Засах"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.04,
    backgroundColor: "#F5F5F5",
    flexGrow: 1,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: width * 0.05,
  },
  profileImage: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    marginBottom: width * 0.03,
  },
  imageButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cameraButton: {
    padding: width * 0.02,
    backgroundColor: "#03A9F4",
    borderRadius: 8,
    marginHorizontal: width * 0.02,
  },
  libraryButton: {
    padding: width * 0.02,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    marginHorizontal: width * 0.02,
  },
  imageButtonText: {
    color: "#FFF",
    fontSize: width * 0.035,
  },
  profileInfo: {
    marginBottom: width * 0.05,
  },
  name: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    marginBottom: width * 0.03,
    textAlign: "center",
  },
  label: {
    fontSize: width * 0.04,
    color: "#333",
    marginTop: width * 0.02,
  },
  text: {
    fontSize: width * 0.045,
    color: "#666",
  },
  input: {
    fontSize: width * 0.045,
    color: "#333",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: width * 0.03,
    paddingVertical: width * 0.01,
  },
  notesInput: {
    height: width * 0.2,
    textAlignVertical: "top",
  },
  financeSection: {
    marginBottom: width * 0.05,
  },
  financeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginBottom: width * 0.03,
  },
  financeText: {
    fontSize: width * 0.045,
    color: "#333",
    marginBottom: width * 0.03,
  },
  editButton: {
    backgroundColor: "#03A9F4",
    paddingVertical: width * 0.04,
    borderRadius: 8,
    alignItems: "center",
    marginTop: width * 0.05,
  },
  editButtonText: {
    color: "#FFF",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: width * 0.045,
    textAlign: "center",
    marginTop: width * 0.1,
  },
});

export default SupplierDetailScreen;
