import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { firestore, storage, auth } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import Button from "../components/Button";
import Text from "../components/Text";
import { TextInput as PaperTextInput } from "react-native-paper";
import Header from "../components/Header";
import CustomBackground from "../components/customBackground";
import ScreenButton from "../components/ScreenButton";

const AddShoeScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [shoeCode, setShoeCode] = useState("");
  const [shoeName, setShoeName] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [addedUserID, setAddedUserID] = useState("");
  const [locationAdded, setLocationAdded] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData(userData);
            setAddedUserID(userData.name); // Автоматаар хэрэглэгчийн нэрийг тохируулах
            setLocationAdded(userData.branch); // Автоматаар салбарыг тохируулах
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("No user is logged in!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    fetchUserData();
  }, []);

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
        addedUserID: userData ? userData.name : "",

        locationAdded: userData ? userData.branch : "",
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
    <CustomBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Header>Гутал шинээр бүргэх</Header>
        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        <Button mode="elevated" icon="file" onPress={openImagePicker}>
          Файлаас сонгох
        </Button>
        <Button mode="outlined" icon="camera" onPress={openCamera}>
          Камер ашиглах
        </Button>
        <View style={styles.row}>
          <Text style={styles.label}>Гутлын код:</Text>
          <PaperTextInput
            placeholder="TMA"
            returnKeyType="next"
            value={shoeName}
            onChangeText={setShoeName}
            style={styles.input}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Гутлын код:</Text>
          <PaperTextInput
            placeholder="00001"
            returnKeyType="next"
            value={shoeCode}
            onChangeText={setShoeCode}
            style={styles.input}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Гутлын размер:</Text>
          <PaperTextInput
            placeholder="34-44"
            returnKeyType="next"
            value={size}
            onChangeText={setSize}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Гутлын үнийн дүн:</Text>
          <PaperTextInput
            placeholder="Үнэ"
            returnKeyType="enter"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Хэрэглэгч:</Text>
          <PaperTextInput
            value={addedUserID}
            onChangeText={setAddedUserID}
            style={styles.input}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Бүртгэсэн хаяг:</Text>
          <PaperTextInput
            value={locationAdded}
            onChangeText={setLocationAdded}
            style={styles.input}
          />
        </View>
        <Button mode="contained" onPress={handleAddShoe}>
          Нэмэх
        </Button>
        <ScreenButton mode="contained" label="Нэмэх"></ScreenButton>
      </ScrollView>
    </CustomBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
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
