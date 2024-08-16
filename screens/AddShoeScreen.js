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
import CustomButton from "../components/CustomButton";
import Text from "../components/Text";
import { TextInput as PaperTextInput } from "react-native-paper";
import CustomBackground from "../components/customBackground";
import ModalSelector from "react-native-modal-selector";

const options = [
  { key: 1, label: "TMA" },
  { key: 2, label: "ABR" },
  { key: 3, label: "BRA" },
  { key: 4, label: "CMB" },
  { key: 5, label: "MDN" },
  { key: 6, label: "RCH" },
  { key: 7, label: "DGA" },
  { key: 8, label: "TAN" },
  { key: 9, label: "BDJ" },
  { key: 10, label: "ARR" },
  { key: 11, label: "ACA" },
  { key: 12, label: "ALA" },
  { key: 13, label: "AHA" },
];

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
            setAddedUserID(userData.name);
            setLocationAdded(userData.branch);
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
      aspect: [3, 4],
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

      const start = new Date().getTime();
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
      const end = new Date().getTime();

      Alert.alert("Гутал амжилттай нэмэгдлээ!");
      console.log(`Өгөгдөл нэмэх хугацаа: ${end - start} ms`);
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
        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        <View style={styles.row}>
          <CustomButton mode="elevated" icon="file" onPress={openImagePicker}>
            Файлаас сонгох
          </CustomButton>
          <CustomButton mode="contained" icon="camera" onPress={openCamera}>
            Камер ашиглах
          </CustomButton>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Гутлын код:</Text>
          <PaperTextInput
            placeholder="A00001"
            returnKeyType="next"
            mode="outlined"
            value={shoeCode}
            onChangeText={setShoeCode}
            style={styles.inputOutlined}
          />
          <ModalSelector
            data={options}
            initValue="AAA"
            onChange={(option) => setShoeName(option.label)}
            style={styles.modalSelector}
            cancelButtonText="Цуцлах"
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
            style={styles.inputSecond}
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
            style={styles.inputSecond}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Хэрэглэгч:</Text>
          <PaperTextInput
            value={addedUserID}
            onChangeText={setAddedUserID}
            style={styles.disabledInput}
            editable={false}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Бүртгэсэн хаяг:</Text>
          <PaperTextInput
            value={locationAdded}
            onChangeText={setLocationAdded}
            style={styles.disabledInput}
            editable={false}
          />
        </View>
        <CustomButton mode="contained" onPress={handleAddShoe}>
          Нэмэх
        </CustomButton>
      </ScrollView>
    </CustomBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop: "10%",
    justifyContent: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    width: "30%",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    width: "35%",
    backgroundColor: "transparent",
  },
  inputSecond: {
    width: "70%",
    backgroundColor: "transparent",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  disabledInput: {
    backgroundColor: "#F1F1F1",
    width: "70%",
  },
  modalSelector: {
    flex: 1,
    backgroundColor: "transparent",
    borderColor: "black",
    height: 40,
  },
  inputOutlined: {
    width: "35%",
    backgroundColor: "transparent",
    height: 40,
  },
});

export default AddShoeScreen;
