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
} from "react-native";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

const AddSupplierScreen = ({ navigation }) => {
  const [code, setCode] = useState(""); // Code input
  const [nameDetail, setNameDetail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [totalShoes, setTotalShoes] = useState("0");
  const [balance, setBalance] = useState("0");
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

  const handleSubmit = async () => {
    if (!code || !nameDetail || !phoneNumber) {
      Alert.alert(
        "Error",
        "Код, Нийлүүлэгчийн нэр болон утасны дугаар заавал байх ёстой."
      );
      return;
    }

    try {
      const db = getFirestore();
      const supplierRef = doc(db, "names", code); // Using the code as the document ID
      await setDoc(supplierRef, {
        nameDetail,
        phoneNumber,
        additionalInfo,
        totalShoes: parseInt(totalShoes, 10),
        balance: parseFloat(balance),
        imageUrl,
      });

      Alert.alert("Success", "Нийлүүлэгчийн мэдээлэл амжилттай нэмэгдлээ.");
      navigation.goBack(); // Go back to SuppliersInfoScreen
    } catch (error) {
      Alert.alert("Error", "Мэдээлэл нэмэхэд алдаа гарлаа.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Код (3-н үсэгтэй)</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        maxLength={3}
        autoCapitalize="characters" // Automatically capitalize input
      />

      <Text style={styles.label}>Нийлүүлэгчийн нэр</Text>
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

      <Text style={styles.label}>Нэмэлт мэдээлэл</Text>
      <TextInput
        style={styles.input}
        value={additionalInfo}
        onChangeText={setAdditionalInfo}
      />

      <Text style={styles.label}>Нийт авсан гутал</Text>
      <TextInput
        style={styles.input}
        value={totalShoes}
        onChangeText={setTotalShoes}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Үлдэгдэл төлбөр</Text>
      <TextInput
        style={styles.input}
        value={balance}
        onChangeText={setBalance}
        keyboardType="numeric"
      />

      <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>
          Зураг сонгох
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Хадгалах</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  imageButton: {
    backgroundColor: "#03A9F4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  imageButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddSupplierScreen;
