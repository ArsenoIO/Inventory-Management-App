import React, { useState } from "react";
import { Image, View, Platform, StyleSheet, Alert } from "react-native";
import { firestore, storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import Text from "../components/Text";

const AddShoeScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [shoeCode, setShoeCode] = useState("");
  const [shoeName, setShoeName] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [addedUserID, setAddedUserID] = useState("");
  const [locationAdded, setLocationAdded] = useState("");

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
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleAddShoe = async () => {
    if (
      !shoeName ||
      !shoeCode ||
      !size ||
      !price ||
      !selectedImage ||
      !addedUserID ||
      !locationAdded
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
        imageUrl,
        shoeDateAdded: Timestamp.fromDate(new Date()), // Current timestamp
        addedUserID,
        locationAdded,
        shoeSoldDate: null,
        shoeSoldPrice: null,
        isTransaction: null,
        isTransactionStorepay: null,
        isTransactionPocket: null,
        isTransactionLendpay: null,
        isTransactionLeesing: null,
        soldUserID: null,
        buyerPhoneNumber: null,
        locationSold: null,
      });

      Alert.alert("Гутал амжилттай нэмэгдлээ!");
      setShoeName("");
      setShoeCode("");
      setSize("");
      setPrice("");
      setSelectedImage(null);
      setAddedUserID("");
      setLocationAdded("");
    } catch (error) {
      Alert.alert("Гутал нэмэхэд алдаа гарлаа: ", error.message);
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      <Text>Энэ бол хэлбэржүүлсэн текст</Text>
      <Button mode="elevated" icon="file" onPress={openImagePicker}>
        Файлаас сонгох
      </Button>
      <Button mode="outlined" icon="camera" onPress={openCamera}>
        Камер ашиглах
      </Button>
      <View style={styles.row}>
        <Text style={styles.label}>Гутлын код:</Text>
        <TextInput
          placeholder="TMA"
          value={shoeName}
          onChangeText={setShoeName}
          style={styles.input}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Гутлын код:</Text>
        <TextInput
          placeholder="00001"
          value={shoeCode}
          onChangeText={setShoeCode}
          style={styles.input}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Гутлын размер:</Text>
        <TextInput
          placeholder="34-44"
          value={size}
          onChangeText={setSize}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Гутлын үнийн дүн:</Text>
        <TextInput
          placeholder="Үнэ"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Хэрэглэгчийн ID:</Text>
        <TextInput
          placeholder="Хэрэглэгчийн ID"
          value={addedUserID}
          onChangeText={setAddedUserID}
          style={styles.input}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Байршлын нэр:</Text>
        <TextInput
          placeholder="Байршлын нэр"
          value={locationAdded}
          onChangeText={setLocationAdded}
          style={styles.input}
        />
      </View>
      <Button mode="contained" title="Нэмэх" onPress={handleAddShoe}>
        Нэмэх
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    width: "30%",
    fontSize: 16,
  },
  input: {
    width: "70%",
    backgroundColor: "transparent",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
});

export default AddShoeScreen;
