import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Switch,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

const AddShoeExpenseScreen = ({ route, navigation }) => {
  const { tripId } = route.params;
  const [supplierCode, setSupplierCode] = useState("");
  const [shoeCount, setShoeCount] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [paymentMade, setPaymentMade] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [nameDetail, setNameDetail] = useState("");
  const [codes, setCodes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const calculateTotalPrice = () => {
    if (shoeCount && unitPrice) {
      return parseFloat(shoeCount) * parseFloat(unitPrice);
    }
    return 0;
  };

  // Calculate store price
  const calculateStorePrice = () => {
    if (unitPrice) {
      return parseFloat(unitPrice) * 36 + 180000;
    }
    return 0;
  };

  const openImagePicker = async () => {
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

  // Fetch supplier codes from Firestore
  useEffect(() => {
    const fetchCodes = async () => {
      const db = getFirestore();
      const namesCollection = collection(db, "names");
      const codesSnapshot = await getDocs(namesCollection);

      const codesData = codesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCodes(codesData);
    };

    fetchCodes();
  }, []);

  const handleSaveShoeExpense = async () => {
    if (!supplierCode || !shoeCount || !unitPrice || !selectedImage) {
      Alert.alert("Анхаар!", "Бүх утгуудыг оруулна уу.");
      return;
    }

    try {
      const db = getFirestore();
      const totalShoeExpense = calculateTotalPrice();

      await addDoc(collection(db, "shoeExpense"), {
        tripId: tripId,
        supplierCode: supplierCode,
        shoeExpense: parseInt(unitPrice, 10),
        totalCost: totalShoeExpense,
        purchasedShoesCount: parseInt(shoeCount, 10),
        paymentMade: paymentMade,
        additionalNotes: additionalNotes,
        image: selectedImage,
        createdAt: new Date(),
        type: "shoeExpense",
        registered: false,
      });

      Alert.alert("Амжилттай!", "Гутлын зардал амжилттай нэмэгдлээ.");
      navigation.goBack();
    } catch (error) {
      console.error("Алдаа гарлаа: ", error);
      Alert.alert("Алдаа", "Гутлын зардлыг нэмэхэд алдаа гарлаа.");
    }
  };

  const renderCodeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.codeItem}
      onPress={() => {
        setSupplierCode(item.id);
        setNameDetail(item.nameDetail);
        setModalVisible(false);
      }}
    >
      <Text style={styles.codeText}>{item.id}</Text>
      <Text style={styles.codeText}>{item.nameDetail}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Нийлүүлэгчийн код:</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text>{supplierCode || "Код сонгох"}</Text>
      </TouchableOpacity>

      {nameDetail ? <Text style={styles.detailText}>{nameDetail}</Text> : null}

      <View style={styles.rowContainer}>
        <View style={styles.columnContainer}>
          <Text style={styles.label}>Тоо:</Text>
          <TextInput
            style={styles.input}
            value={shoeCount}
            keyboardType="numeric"
            onChangeText={setShoeCount}
            placeholder="Гутлын тоо оруулна уу"
          />
        </View>
        <Text style={styles.multiplySymbol}>x</Text>
        <View style={styles.columnContainer}>
          <Text style={styles.label}>Нэгж үнэ:</Text>
          <TextInput
            style={styles.input}
            value={unitPrice}
            keyboardType="numeric"
            onChangeText={setUnitPrice}
            placeholder="Гутлын нэгж үнэ оруулна уу"
          />
        </View>
      </View>
      <Text style={styles.totalPriceText}>
        Нийт үнэ: {calculateTotalPrice()}
      </Text>

      <Text style={styles.storePriceText}>
        Дэлгүүрт зарагдах үнэ: {calculateStorePrice()}₮
      </Text>

      <View style={styles.switchContainer}>
        <Text>Төлбөр төлөгдсөн:</Text>
        <Switch value={paymentMade} onValueChange={setPaymentMade} />
      </View>

      <Text style={styles.label}>Нэмэлт тэмдэглэл:</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        value={additionalNotes}
        onChangeText={setAdditionalNotes}
        placeholder="Нэмэлт мэдээлэл оруулна уу"
        multiline
      />

      <View style={styles.imagePickerContainer}>
        <TouchableOpacity style={styles.imagePicker} onPress={openImagePicker}>
          <Text style={styles.imagePickerText}>Зураг сонгох</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imagePicker} onPress={openCamera}>
          <Text style={styles.imagePickerText}>Камераар зураг дарах</Text>
        </TouchableOpacity>

        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        )}
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveShoeExpense}
      >
        <Text style={styles.saveButtonText}>Гутлын зардал нэмэх</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Нийлүүлэгчийн код сонгох</Text>
            <FlatList
              data={codes}
              renderItem={renderCodeItem}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Буцах</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  storePriceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 16,
  },
  columnContainer: {
    flex: 1,
    alignItems: "left",
  },
  multiplySymbol: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6347",
    marginBottom: 16,
    textAlign: "center",
  },
  container: {
    padding: 16,
    backgroundColor: "#FFF",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#FAFAFA",
  },
  detailText: {
    marginBottom: 16,
    color: "#666",
    fontSize: 14,
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6347",
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imagePickerContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
  imagePicker: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#03A9F4",
    borderRadius: 8,
    marginVertical: 5,
  },
  imagePickerText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  codeItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  codeText: {
    fontSize: 16,
    color: "#333",
  },
  modalCloseButton: {
    paddingVertical: 12,
    backgroundColor: "#FF6347",
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default AddShoeExpenseScreen;
