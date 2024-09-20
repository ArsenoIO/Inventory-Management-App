import React, { useState, useEffect, useCallback } from "react";
import {
  Image,
  View,
  Platform,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  Button,
  db,
} from "react-native";
import { firestore, storage } from "../../../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../../components/CustomButton";
import NameSelector from "../../components/NameSelector";
import { TextInput as PaperTextInput, ProgressBar } from "react-native-paper";
import ModalSelector from "react-native-modal-selector";
import useUserData from "../../hooks/useUserData"; // Custom Hook ашиглаж байна

const AddShoeScreen = () => {
  const { userData, loading: userLoading, error } = useUserData(); // Custom hook ашиглаж байна

  const [selectedImage, setSelectedImage] = useState(null);
  const [shoeCode, setShoeCode] = useState("");
  const [shoeName, setShoeName] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {}, []);

  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Зургийн сан руу хандах зөвшөөрөл хэрэгтэй байна!");
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

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (!shoeName) {
      errors.shoeName = "Гутлын нэр шаардлагатай";
      valid = false;
    }
    if (!shoeCode) {
      errors.shoeCode = "Гутлын код шаардлагатай";
      valid = false;
    }
    if (!size || isNaN(size) || parseInt(size) < 34 || parseInt(size) > 46) {
      errors.size = "Размерийн утгыг зөв оруулна уу (34-46)";
      valid = false;
    }
    if (
      !price ||
      isNaN(price) ||
      parseInt(price) < 500000 ||
      parseInt(price) > 2500000
    ) {
      errors.price = "Зөв үнэ оруулна уу (500,000-2,500,000)";
      valid = false;
    }
    if (!selectedImage) {
      errors.selectedImage = "Зураг оруулна уу";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleAddShoe = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const existingShoeDoc = await getDoc(doc(firestore, "shoes", shoeCode));
      if (existingShoeDoc.exists()) {
        Alert.alert("Гутал аль хэдийн бүртгэгдсэн байна.");
        setLoading(false);
        return;
      }

      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `shoes/${shoeCode}.jpg`);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      const shoeData = {
        shoeCode,
        shoeName,
        shoePrice: price,
        shoeSize: size,
        addedDate: Timestamp.fromDate(new Date()),
        ImageUrl: imageUrl,
        addedUserID: userData ? userData.userName : "",
        addedBranch: userData ? userData.branch : "",
        isSold: false,
        transactionMethod: "",
        soldUserID: "",
        buyerPhoneNumber: "",
        soldBranch: "",
        soldDate: null,
        soldPrice: null,
      };

      // Гутлын мэдээллийг Firestore дээр нэмэх
      await setDoc(doc(firestore, "shoes", shoeCode), shoeData);

      // Салбарын branchName-ийг шүүж олж, totalShoe утгыг нэмэгдүүлэх
      const db = getFirestore();
      const branchesCollection = collection(db, "branches");
      const branchQuery = query(
        branchesCollection,
        where("branchName", "==", userData.branch)
      );

      const querySnapshot = await getDocs(branchQuery);
      if (!querySnapshot.empty) {
        const branchDoc = querySnapshot.docs[0]; // Эхний тохирсон баримтыг авна
        const currentTotalShoe = branchDoc.data().totalShoe || 0;

        // totalShoe-г 1-ээр нэмэгдүүлнэ
        await updateDoc(branchDoc.ref, {
          totalShoe: currentTotalShoe + 1,
        });
      } else {
        console.error("Салбар олдсонгүй");
      }

      // Бүртгэлийн дараах талбаруудыг цэвэрлэх
      setShoeName("");
      setShoeCode("");
      setSize("");
      setPrice("");
      setSelectedImage(null);
      Alert.alert("Гутал амжилттай бүртгэгдлээ.");
    } catch (error) {
      Alert.alert("Гутал нэмэхэд алдаа гарлаа: ", error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      <View style={styles.row}>
        <CustomButton
          icon="file"
          label="Файлаас сонгох"
          onPress={openImagePicker}
          mode="elevated"
          labelColor="black"
          style={{ width: "50%" }}
        />

        <CustomButton
          icon="camera"
          label="Камер ашиглах"
          onPress={openCamera}
          mode="elevated"
          labelColor="white"
          style={{ width: "50%" }}
        />
      </View>
      {loading && (
        <ProgressBar indeterminate color="#CE5A67" style={styles.progress} />
      )}
      <PaperTextInput
        label="Гутлын код"
        value={shoeCode}
        onChangeText={setShoeCode}
        maxLength={6}
        mode="outlined"
        style={styles.input}
        error={!!errors.shoeCode}
      />
      {errors.shoeCode && (
        <Text style={styles.errorText}>{errors.shoeCode}</Text>
      )}

      <NameSelector selectedName={shoeName} onSelect={setShoeName} />

      {errors.shoeName && (
        <Text style={styles.errorText}>{errors.shoeName}</Text>
      )}

      <PaperTextInput
        label="Гутлын размер"
        value={size}
        onChangeText={setSize}
        keyboardType="numeric"
        maxLength={2}
        mode="outlined"
        style={styles.input}
        error={!!errors.size}
      />
      {errors.size && <Text style={styles.errorText}>{errors.size}</Text>}

      <PaperTextInput
        label="Гутлын үнийн дүн"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        maxLength={7}
        mode="outlined"
        style={styles.input}
        error={!!errors.price}
      />
      {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

      <PaperTextInput
        label="Хэрэглэгч"
        value={userData ? userData.userName : ""}
        mode="outlined"
        style={[styles.input, { backgroundColor: "#f5ebe0" }]}
        editable={false}
      />

      <PaperTextInput
        label="Бүртгэсэн хаяг"
        value={userData ? userData.branch : ""}
        mode="outlined"
        style={[styles.input, { backgroundColor: "#f5ebe0" }]}
        editable={false}
      />

      <View style={styles.button}>
        <CustomButton
          mode="contained"
          icon="plus-circle"
          onPress={handleAddShoe}
          disabled={loading}
        >
          ГУТАЛ БҮРТГЭХ
        </CustomButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  input: {
    marginVertical: 10,
    backgroundColor: "transparent",
    width: "100%", // Make input full width
    height: 35,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  progress: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default AddShoeScreen;
