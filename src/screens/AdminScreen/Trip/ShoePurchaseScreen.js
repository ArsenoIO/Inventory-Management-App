import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Камераас зураг авах
import { getFirestore, doc, updateDoc } from "firebase/firestore"; // Firebase Firestore
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage
import uuid from "react-native-uuid"; // Зургийн нэр үүсгэх

const ShoePurchaseScreen = ({ navigation, route }) => {
  const { tripId } = route.params; // Trip дэлгэцээс tripId-г авна
  const [supplier, setSupplier] = useState("");
  const [shoesCount, setShoesCount] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState(null); // Зураг хадгалах талбар

  // Камераас зураг авах функц
  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Камер ашиглах эрх олгоно уу");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Зургийн URI-г хадгална
    }
  };

  // Хадгалах функц
  const handleSave = async () => {
    if (!supplier || !shoesCount || !price || !imageUri) {
      Alert.alert("Алдаа", "Бүх талбаруудыг бөглөнө үү");
      return;
    }

    const totalCost = parseFloat(price) * parseInt(shoesCount);

    try {
      // Firebase Storage дээр зураг хадгалах
      const storage = getStorage();
      const imageId = uuid.v4(); // Зургийн санамсаргүй нэр үүсгэнэ
      const storageRef = ref(storage, `shoeImages/${imageId}.jpg`);

      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      // Зургийн URL-г авах
      const imageUrl = await getDownloadURL(storageRef);

      // Firebase Firestore дээр гутлын зардлыг хадгалах
      const firestore = getFirestore();
      const tripDocRef = doc(firestore, "trips", tripId);

      await updateDoc(tripDocRef, {
        shoeExpenses: {
          supplier,
          shoesCount: parseInt(shoesCount),
          price: totalCost,
          imageUrl, // Гутлын зураг
        },
      });

      Alert.alert("Амжилттай", "Гутал амжилттай нэмэгдлээ");
      navigation.goBack();
    } catch (error) {
      console.error("Гутал хадгалах үед алдаа гарлаа: ", error);
      Alert.alert("Алдаа", "Гутал хадгалах үед алдаа гарлаа");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Гутал худалдан авах</Text>

      <Text>Нийлүүлэгчийн нэр:</Text>
      <TextInput
        style={styles.input}
        placeholder="Нийлүүлэгчийн нэр"
        value={supplier}
        onChangeText={setSupplier}
      />

      <Text>Гутлын тоо:</Text>
      <TextInput
        style={styles.input}
        placeholder="Гутлын тоо"
        value={shoesCount}
        onChangeText={setShoesCount}
        keyboardType="numeric"
      />

      <Text>Гутлын нэгж үнэ:</Text>
      <TextInput
        style={styles.input}
        placeholder="Гутлын нэгж үнэ"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Гутлын зураг сонгох</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Болих"
          onPress={() => navigation.goBack()}
          color="#CE5A67"
        />
        <Button title="Хадгалах" onPress={handleSave} color="#28a745" />
      </View>
    </View>
  );
};

export default ShoePurchaseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FCF5ED",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#CE5A67",
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  imagePicker: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  imagePickerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
