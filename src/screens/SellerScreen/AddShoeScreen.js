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
  TouchableOpacity,
  Dimensions,
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

const { width, height } = Dimensions.get("window");

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
      <View style={styles.pickContainer}>
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Гутлын зураг</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.chooseFileButton]}
            onPress={openImagePicker}
          >
            <Text style={styles.buttonText}>Файлаас сонгох</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.useCameraButton]}
            onPress={openCamera}
          >
            <Text style={styles.buttonText}>Камер ашиглах</Text>
          </TouchableOpacity>
        </View>
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
        <TouchableOpacity
          style={styles.addShoeButton}
          onPress={handleAddShoe}
          disabled={loading}
        >
          <Text style={styles.addShoeButtonText}>ГУТАЛ БҮРТГЭХ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.05,
    backgroundColor: "#F5F5F5",
  },
  pickContainer: {
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  imageContainer: {
    width: width * 0.7,
    height: height * 0.4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
    backgroundColor: "#ffff",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#aaa",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: height * 0.015,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginHorizontal: width * 0.02,
  },
  chooseFileButton: {
    backgroundColor: "#FFB74D",
  },
  useCameraButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  progress: {
    marginVertical: height * 0.02,
  },
  input: {
    marginBottom: height * 0.02,
  },
  errorText: {
    color: "#D32F2F",
    marginBottom: height * 0.01,
    fontSize: 14,
  },
  addShoeButton: {
    backgroundColor: "#CE5A67",
    paddingVertical: height * 0.02,
    width: 150,
    borderRadius: 5,
    alignItems: "center",
  },
  addShoeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddShoeScreen;
