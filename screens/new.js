import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  TextInput,
} from "react-native";
import { firestore, storage, auth } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../components/CustomButton";
import { TextInput as PaperTextInput, ProgressBar } from "react-native-paper";
import CustomBackground from "../components/customBackground";
import ModalSelector from "react-native-modal-selector";
import NumberFormat from "react-number-format";

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
  const [loading, setLoading] = useState(false); // Нэмэлт: Уншилтын явцын төлөв

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

    if (!/^A\d{5}$/.test(shoeCode)) {
      Alert.alert("Гутлын код A00000 форматтай байх ёстой.");
      return;
    }

    const sizeNumber = parseInt(size, 10);
    if (sizeNumber < 34 || sizeNumber > 46) {
      Alert.alert("Гутлын размер зөвхөн 34-46 дотор байх ёстой.");
      return;
    }

    const priceNumber = parseInt(price.replace(/,/g, ""), 10); // Оронгийн таслалыг арилгана
    if (priceNumber < 500000 || priceNumber > 2500000) {
      Alert.alert("Гутлын үнэ 500,000-2,500,000 дотор байх ёстой.");
      return;
    }

    try {
      setLoading(true); // Нэмэлт: Уншилтын явцыг эхлүүлнэ

      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `shoes/${shoeCode}.jpg`);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(firestore, "shoes"), {
        shoeName,
        shoeCode,
        size,
        price: priceNumber, // Оронгийн таслалгүй хадгалах
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

      setLoading(false); // Нэмэлт: Уншилт дуусна
      Alert.alert("Гутал амжилттай нэмэгдлээ!");
      setShoeName("");
      setShoeCode("");
      setSize("");
      setPrice("");
      setSelectedImage(null);
      setAddedUserID("");
      setLocationAdded("");
    } catch (error) {
      setLoading(false); // Нэмэлт: Алдаа гарвал уншилтыг зогсооно
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
            onChangeText={(text) => {
              // Гутлын кодыг зөвхөн A үсэг болон 5 цифртэйгээр хязгаарлана
              if (/^A\d{0,5}$/.test(text)) {
                setShoeCode(text);
              }
            }}
            maxLength={6} // Код 6 тэмдэгтээс ихгүй байх
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
            onChangeText={(text) => {
              // 34-46 хооронд зөвшөөрөгдсөн утга
              if (/^\d{0,2}$/.test(text)) {
                const number = parseInt(text, 10);
                if (number >= 34 && number <= 46) {
                  setSize(text);
                } else if (text === "") {
                  setSize(text);
                }
              }
            }}
            keyboardType="numeric"
            style={styles.inputOutlined}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Гутлын үнэ:</Text>
          <NumberFormat
            value={price}
            displayType={"text"}
            thousandSeparator={true}
            renderText={(formattedValue) => (
              <PaperTextInput
                placeholder="500,000-2,500,000"
                returnKeyType="next"
                value={formattedValue}
                onChangeText={(text) => {
                  // Оронгийн таслалыг арилгана
                  const cleanValue = text.replace(/,/g, "");
                  if (/^\d*$/.test(cleanValue)) {
                    setPrice(cleanValue);
                  }
                }}
                keyboardType="numeric"
                style={styles.inputOutlined}
              />
            )}
          />
        </View>

        <View style={styles.row}>
          <CustomButton
            mode="contained"
            icon="plus-circle"
            onPress={handleAddShoe}
            disabled={loading} // Нэмэлт: Уншилтын үед идэвхгүй болно
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
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  row: {
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputOutlined: {
    backgroundColor: "#fff",
  },
  modalSelector: {
    marginTop: 12,
    backgroundColor: "#fff",
  },
  progress: {
    marginTop: 20,
  },
});

export default AddShoeScreen;
