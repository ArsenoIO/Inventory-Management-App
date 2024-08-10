import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { firestore, storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

const AddShoeScreen = () => {
  const [shoeName, setShoeName] = useState("");
  const [shoeCode, setShoeCode] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
      }
    }
  };

  const openImagePicker = async () => {
    await requestPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri);
    }
  };

  const handleAddShoe = async () => {
    if (
      !shoeName ||
      !shoeCode ||
      !size ||
      !price ||
      !quantity ||
      !selectedImage
    ) {
      Alert.alert("Бүх мэдээллээ оруулна уу.");
      return;
    }

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `shoes/${shoeCode}.jpg`);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(firestore, "shoes"), {
        shoeName,
        shoeCode,
        size,
        price,
        quantity,
        imageUrl,
        dateAdded: new Date().toISOString(),
      });

      Alert.alert("Гутал амжилттай нэмэгдлээ!");
      setShoeName("");
      setShoeCode("");
      setSize("");
      setPrice("");
      setQuantity("");
      setSelectedImage(null);
    } catch (error) {
      Alert.alert("Гутал нэмэхэд алдаа гарлаа: ", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imagePicker} onPress={openImagePicker}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <Text>Зургийг төхөөрөмжөөс сонгох</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.imagePicker} onPress={openCamera}>
        <Text>Камераар зураг авах</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Гутлын нэр"
        value={shoeName}
        onChangeText={setShoeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Гутлын код"
        value={shoeCode}
        onChangeText={setShoeCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Хэмжээ"
        value={size}
        onChangeText={setSize}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Үнэ"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Тоо"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <Button title="Нэмэх" onPress={handleAddShoe} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default AddShoeScreen;
