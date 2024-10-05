import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  getFirestore,
  doc,
  updateDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

const AddShoeExpenseScreen = ({ route, navigation }) => {
  const { tripId } = route.params;
  const [supplierCode, setSupplierCode] = useState("");
  const [shoeCount, setShoeCount] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [paymentMade, setPaymentMade] = useState(false); // Checkbox for payment status
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // Image state for uploading

  // Calculate total price automatically when shoeCount or unitPrice changes
  const calculateTotalPrice = () => {
    if (shoeCount && unitPrice) {
      return parseFloat(shoeCount) * parseFloat(unitPrice);
    }
    return 0;
  };

  // Image picker function (choose from gallery)
  const openImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Camera function (take a picture)
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

  // Handle saving the shoe expense data
  const handleSaveShoeExpense = async () => {
    if (!supplierCode || !shoeCount || !unitPrice || !selectedImage) {
      Alert.alert("Анхаар!", "Бүх утгуудыг оруулна уу.");
      return;
    }

    try {
      const db = getFirestore();
      const totalShoeExpense = calculateTotalPrice();

      // Firestore-д wwtripDetail цуглуулгад хадгалах шинэ баримт үүсгэнэ
      await addDoc(collection(db, "shoeExpense"), {
        tripId: tripId, // Аяллын ID reference болгож хадгалах
        supplierCode: supplierCode.toUpperCase(), // Нийлүүлэгчийн код
        shoeExpense: parseInt(unitPrice, 10), // Нийт гутлын зардал
        totalCost: totalShoeExpense,
        purchasedShoesCount: parseInt(shoeCount, 10), // Худалдан авсан гутлын тоо
        paymentMade: paymentMade, // Төлбөр төлөгдсөн эсэх
        additionalNotes: additionalNotes, // Нэмэлт тэмдэглэл
        image: selectedImage, // Зураг хадгалах
        createdAt: new Date(), // Бүртгэл үүсгэсэн огноо
        type: "shoeExpense", // Type of the expense
        registered: false, // Гутал бүртгэгдсэн эсэх (false)
      });

      Alert.alert("Амжилттай!", "Гутлын зардал амжилттай нэмэгдлээ.");
      navigation.goBack();
    } catch (error) {
      console.error("Алдаа гарлаа: ", error);
      Alert.alert("Алдаа", "Гутлын зардлыг нэмэхэд алдаа гарлаа.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Supplier Code */}
      <Text>Нийлүүлэгчийн код (3 үсэг):</Text>
      <TextInput
        style={styles.input}
        value={supplierCode}
        onChangeText={setSupplierCode}
        placeholder="Жишээ нь: ABC"
        maxLength={3} // Limit to 3 characters
      />

      {/* Shoe Count */}
      <Text>Худалдан авсан гутлын тоо:</Text>
      <TextInput
        style={styles.input}
        value={shoeCount}
        keyboardType="numeric"
        onChangeText={setShoeCount}
        placeholder="Гутлын тоо оруулна уу"
      />

      {/* Unit Price */}
      <Text>Нэг гутлын үнэ:</Text>
      <TextInput
        style={styles.input}
        value={unitPrice}
        keyboardType="numeric"
        onChangeText={setUnitPrice}
        placeholder="Гутлын нэгж үнэ оруулна уу"
      />

      {/* Display Total Price */}
      <Text style={styles.totalPriceText}>
        Нийт үнэ: {calculateTotalPrice()}₮
      </Text>

      {/* Payment Status */}
      <View style={styles.switchContainer}>
        <Text>Төлбөр төлөгдсөн:</Text>
        <Switch value={paymentMade} onValueChange={setPaymentMade} />
      </View>

      {/* Additional Notes */}
      <Text>Нэмэлт тэмдэглэл:</Text>
      <TextInput
        style={styles.input}
        value={additionalNotes}
        onChangeText={setAdditionalNotes}
        placeholder="Нэмэлт мэдээлэл оруулна уу"
        multiline
      />

      {/* Image Picker and Camera */}
      <View style={styles.imagePickerContainer}>
        <TouchableOpacity style={styles.imagePicker} onPress={openImagePicker}>
          <Text>Зураг сонгох</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imagePicker} onPress={openCamera}>
          <Text>Камераар зураг дарах</Text>
        </TouchableOpacity>

        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        )}
      </View>

      {/* Save Button */}
      <Button title="Гутлын зардал нэмэх" onPress={handleSaveShoeExpense} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 10,
    borderRadius: 5,
  },
  totalPriceText: {
    marginTop: 10,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  imagePickerContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  imagePicker: {
    padding: 10,
    backgroundColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});

export default AddShoeExpenseScreen;
