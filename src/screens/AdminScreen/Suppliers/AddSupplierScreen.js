import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

const AddSupplierScreen = ({ navigation }) => {
  const [code, setCode] = useState("");
  const [nameDetail, setNameDetail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  // Image picker function
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const uploadImageToStorage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const storageRef = ref(storage, `names/${code}-${Date.now()}`); // Unique filename

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Зургийг байршуулж чадсангүй:", error);
      Alert.alert("Алдаа", "Зургийг хадгалахад алдаа гарлаа.");
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!code || !nameDetail) {
      Alert.alert("Алдаа", "Код болон нэр заавал байх ёстой.");
      return;
    }

    try {
      let imageURL = null;
      if (imageUrl) {
        imageURL = await uploadImageToStorage(imageUrl); // Зургийг хадгална
        if (!imageURL) return; // Хэрэв зураг байршуулж чадвал үргэлжлүүлнэ
      }

      const db = getFirestore();
      const supplierRef = doc(db, "names", code);
      await setDoc(supplierRef, {
        nameDetail,
        phoneNumber,
        additionalInfo: "",
        totalShoes: 0,
        balance: 0,
        imageUrl: imageURL, // Зураг URL-ыг хадгалах
      });

      Alert.alert("Амжилттай", "Нийлүүлэгчийн мэдээлэл амжилттай нэмэгдлээ.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Алдаа", "Мэдээлэл нэмэхэд алдаа гарлаа.");
      console.error("Firestore-д бичихэд алдаа гарлаа:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image Picker at the top */}
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>Зураг сонгох</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Товчилсон Код (3-н үсэгтэй)</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        maxLength={3}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Нэр</Text>
      <TextInput
        style={styles.input}
        value={nameDetail}
        onChangeText={setNameDetail}
      />

      <Text style={styles.label}>Утасны дугаар</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Хадгалах</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.05,
    backgroundColor: "#FAFAFA",
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0E0E0",
    padding: width * 0.05,
    borderRadius: 8,
    marginBottom: width * 0.05,
  },
  imagePickerText: {
    fontSize: width * 0.04,
    color: "#555",
  },
  imagePreview: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 8,
  },
  label: {
    fontSize: width * 0.04,
    marginBottom: width * 0.02,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: width * 0.03,
    borderRadius: 8,
    marginBottom: width * 0.04,
    backgroundColor: "#FFF",
    fontSize: width * 0.04,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: width * 0.04,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});

export default AddSupplierScreen;
