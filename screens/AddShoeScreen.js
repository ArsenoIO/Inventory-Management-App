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
import { FAB } from "react-native-paper";
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
      !addedBranch
    ) {
      Alert.alert("Бүх мэдээллээ оруулна уу.");
      return;
    }

    const sizeNumber = parseInt(size, 10);
    if (sizeNumber < 34 || sizeNumber > 46) {
      Alert.alert("Гутлын размерийг дахин нягтална уу");
      return;
    }

    const priceNumber = parseInt(price.replace(/,/g, ""), 10);
    if (priceNumber < 500000 || priceNumber > 2500000) {
      Alert.alert("Гутлын үнийн дүнг дахин нягтална уу");
      return;
    }

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
        shoePrice: priceNumber,
        shoeSize: sizeNumber,
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
          value={addedBranch}
          onChangeText={setAddedBranch}
          style={styles.disabledInput}
          editable={false}
        />
      </View>

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
  tableTitle: {
    paddingHorizontal: 10, // Багана хоорондын зайг нэмэгдүүлнэ
    textAlign: "center", // Текстийг голлуулж харуулна
  },
  button: {
    justifyContent: "center",
    alignItems: "center", // Center the button horizontally
    marginVertical: 10,
  },
  tableCell: {
    paddingHorizontal: 10, // Багана хоорондын зайг нэмэгдүүлнэ
    textAlign: "center", // Текстийг голлуулж харуулна
  },
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop: "10%",
    justifyContent: "top",
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
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },
  label: {
    width: "30%",
    fontSize: 16,
    fontWeight: "bold",
    color: "#2F4F4F",
  },
  fab: {
    width: "80%",
    borderRadius: 50, // Make it fully rounded
    justifyContent: "center",
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
