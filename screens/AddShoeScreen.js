import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { firestore, storage, auth } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { collection, getDocs, query, where } from "firebase/firestore"; // getDocs функц нэмэх
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../components/CustomButton";
import Text from "../components/Text";
import CustomFAB from "../components/FabButton";
import {
  TextInput as PaperTextInput,
  ProgressBar,
  DataTable,
} from "react-native-paper";
import ModalSelector from "react-native-modal-selector";

const EditModal = ({ visible, onClose, onEdit, onDelete }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Мэдээллийг шинэчлэх</Text>
          <CustomButton
            mode="contained"
            onPress={onEdit}
            style={styles.modalButton}
          >
            Засварлах
          </CustomButton>
          <CustomButton
            mode="contained"
            onPress={onDelete}
            style={styles.modalButton}
          >
            Устгах
          </CustomButton>
          <CustomButton mode="text" onPress={onClose}>
            Болих
          </CustomButton>
        </View>
      </View>
    </Modal>
  );
};

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
  const [addedBranch, setAddedBranch] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shoesList, setShoesList] = useState([]); // Бүх гутлын мэдээллийг хадгалах төлөв
  const [selectedShoe, setSelectedShoe] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLongPress = (shoe) => {
    setSelectedShoe(shoe);
    setModalVisible(true);
  };

  const handleEdit = () => {
    setModalVisible(false);
    // Засварлах үйлдлийг энд нэмэх
    Alert.alert(
      "Засварлах үйлдэл",
      `Гутал засварлах: ${selectedShoe.shoeCode}`
    );
  };

  const handleDelete = () => {
    setModalVisible(false);
    // Устгах үйлдлийг энд нэмэх
    Alert.alert("Устгах үйлдэл", `Гутал устгах: ${selectedShoe.shoeCode}`);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData(userData);
            setAddedUserID(userData.userName);
            setAddedBranch(userData.branch);
          } else {
            console.log("No such document! Printing addshoeScreem from");
          }
        } else {
          console.log("No user is logged in!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    fetchUserData();
    fetchShoes();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } = {};
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

      await setDoc(doc(firestore, "shoes", shoeCode), shoeData);

      // Шинэ гутлыг жагсаалтад нэмэх
      setShoesList([...shoesList, shoeData]);

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
      setLoading(false);
    }
    fetchShoes();
  };

  const fetchShoes = async () => {
    try {
      // Firestore-оос isSold == false (зарагдаагүй) гутлуудыг шүүж авах
      const q = query(
        collection(firestore, "shoes"),
        where("isSold", "==", false)
      );
      const querySnapshot = await getDocs(q);
      const shoes = [];
      querySnapshot.forEach((doc) => {
        shoes.push({
          ...doc.data(),
          shoeCode: doc.id, // Document ID-г shoeCode гэж нэрлээд хадгалж байна
        });
      });
      setShoesList(shoes);
    } catch (error) {
      console.error("Error fetching shoes: ", error);
      Alert.alert("Гутлуудыг татах явцад алдаа гарлаа.");
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
        <CustomFAB
          icon="file"
          label="Файлаас сонгох"
          onPress={openImagePicker}
          mode="elevated"
          labelColor="black"
        />

        <CustomFAB
          icon="camera"
          label="Камер ашиглах"
          onPress={openCamera}
          mode="elevated"
          labelColor="white"
        />
      </View>
      <PaperTextInput
        label="Гутлын код"
        value={shoeCode}
        onChangeText={setShoeCode}
        maxLength={5}
        mode="outlined"
        style={styles.input}
        error={!!errors.shoeCode}
      />
      {errors.shoeCode && (
        <Text style={styles.errorText}>{errors.shoeCode}</Text>
      )}
      <ModalSelector
        data={options}
        onChange={(option) => setShoeName(option.label)}
        style={styles.modalSelector}
        error={!!errors.shoeName}
        cancelButtonText="Цуцлах"
      />
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
        value={addedUserID}
        onChangeText={setAddedUserID}
        mode="outlined"
        style={[styles.input, { backgroundColor: "#f5ebe0" }]}
        editable={false}
      />

      <PaperTextInput
        label="Бүртгэсэн хаяг"
        value={addedBranch}
        onChangeText={setAddedBranch}
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

      {loading && (
        <ProgressBar indeterminate color="#CE5A67" style={styles.progress} />
      )}

      {/* DataTable хэсэг */}
      <ScrollView horizontal={true}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={styles.tableTitle}>
              Гутлын Код
            </DataTable.Title>
            <DataTable.Title style={styles.tableTitle}>Нэр</DataTable.Title>
            <DataTable.Title numeric style={styles.tableTitle}>
              Размер
            </DataTable.Title>
            <DataTable.Title numeric style={styles.tableTitle}>
              Үнэ
            </DataTable.Title>
            <DataTable.Title style={styles.tableTitle}>Салбар</DataTable.Title>
            <DataTable.Title style={styles.tableTitle}>
              Хэрэглэгч
            </DataTable.Title>
          </DataTable.Header>

          {shoesList.map((shoe, index) => (
            <DataTable.Row
              key={index}
              onLongPress={() => handleLongPress(shoe)}
              style={styles.tableRow}
            >
              <DataTable.Cell style={styles.tableCell}>
                {shoe.shoeCode}
              </DataTable.Cell>
              <DataTable.Cell style={styles.tableCell}>
                {shoe.shoeName}
              </DataTable.Cell>
              <DataTable.Cell numeric style={styles.tableCell}>
                {shoe.shoeSize}
              </DataTable.Cell>
              <DataTable.Cell numeric style={styles.tableCell}>
                {shoe.shoePrice}
              </DataTable.Cell>
              <DataTable.Cell style={styles.tableCell}>
                {shoe.addedBranch}
              </DataTable.Cell>
              <DataTable.Cell style={styles.tableCell}>
                {shoe.addedUserID}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>

      <EditModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop: "10%",
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
  tableTitle: {
    paddingHorizontal: 10, // Багана хоорондын зайг нэмэгдүүлнэ
    textAlign: "center", // Текстийг голлуулж харуулна
  },
  tableCell: {
    paddingHorizontal: 10, // Багана хоорондын зайг нэмэгдүүлнэ
    textAlign: "center", // Текстийг голлуулж харуулна
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    width: "100%",
  },
  fab: {
    width: "80%",
    borderRadius: 50, // Make it fully rounded
    justifyContent: "center",
  },
  modalSelector: {
    flex: 1,
    backgroundColor: "transparent",
    borderColor: "black",
    height: 40,
    marginVertical: 10,
  },
});

export default AddShoeScreen;
