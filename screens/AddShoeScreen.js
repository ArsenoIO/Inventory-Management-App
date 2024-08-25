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
import { TextInput as PaperTextInput, ProgressBar } from "react-native-paper";
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
  const [loading, setLoading] = useState(false);

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
      quality: 0.9,
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
      quality: 0.9,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("mn-MN").format(price);
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

    if (!/^A\d{5}$/.test(shoeCode)) {
      Alert.alert("Гутлын код A00000 форматтай байх ёстой.");
      return;
    }
    const sizeNumber = parseInt(size, 10);
    if (sizeNumber < 34 || sizeNumber > 46) {
      Alert.alert("Гутлын размер зөвхөн 34-46 дотор байх ёстой.");
      return;
    }

    const priceNumber = parseInt(price.replace(/,/g, ""), 10);
    if (priceNumber < 300 || priceNumber > 2500000) {
      Alert.alert("Гутлын үнийн дүн 500,000 - 2,500,000 хооронд байх ёстой.");
      return;
    }

    try {
      setLoading(true); // Уншилт эхлэхээс өмнө Loading төлөвийг true болгоно
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `shoes/${shoeCode}.jpg`);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(firestore, "shoes"), {
        shoeName,
        shoeCode,
        size,
        price: priceNumber,
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
    } catch (error) {
      Alert.alert("Гутал нэмэхэд алдаа гарлаа: ", error.message);
      console.log(error.message);
    } finally {
      setLoading(false); // Уншилт дууссаны дараа Loading төлөвийг false болгоно
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
            onChangeText={(text) => {
              if (/^A\d{0,5}$/.test(text)) {
                setShoeCode(text);
              }
            }}
            maxLength={6}
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
            placeholder="34-46"
            returnKeyType="next"
            value={size}
            onChangeText={(text) => {
              const number = parseInt(text, 10);
              if (!isNaN(number) && number >= 1 && number <= 46) {
                setSize(text);
              }
            }}
            keyboardType="numeric"
            style={styles.inputSecond}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Гутлын үнийн дүн:</Text>
          <PaperTextInput
            placeholder="500000"
            returnKeyType="enter"
            value={formatPrice(price)}
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

        <View style={styles.row}>
          <CustomButton
            mode="contained"
            icon="plus-circle"
            onPress={handleAddShoe}
            disabled={loading} // Уншилтын үед идэвхгүй болно
          >
            Гутал нэмэх
          </CustomButton>
        </View>

        {loading && (
          <ProgressBar indeterminate color="#CE5A67" style={styles.progress} />
        )}
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
  progress: {
    marginTop: 20,
  },
});

export default AddShoeScreen;
