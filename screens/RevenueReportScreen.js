import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import {
  TextInput as PaperTextInput,
  Text as PaperText,
  IconButton,
  RadioButton,
  Divider,
} from "react-native-paper";
import { firestore, auth } from "../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  updateDoc,
  query,
  where,
  getDocs,
  setDoc,
  increment,
} from "firebase/firestore";
import CustomButton from "../components/CustomButton";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import ConfirmationDialog from "../components/ConfirmationDialog";

const RevenueReportScreen = () => {
  const [shoeCode, setShoeCode] = useState("");
  const [shoeSize, setShoeSize] = useState("");
  const [shoePrice, setShoePrice] = useState("");
  const [shoeSoldPrice, setShoeSoldPrice] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Шууд төлөлт");

  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [soldShoes, setSoldShoes] = useState([]);

  const [userData, setUserData] = useState(null);
  const [documentId, setDocumentId] = useState("");
  const [shoeId, setShoeId] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({});

  const [isCheckDialogVisible, setIsCheckDialogVisible] = useState(false);
  const [isSaveDialogVisible, setIsSaveDialogVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    fetchUserData();
  }, []);

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (!shoeCode) {
      errors.shoeCode = "Гутлын код шаардлагатай";
      valid = false;
    }
    if (!shoeSoldPrice || isNaN(shoeSoldPrice)) {
      errors.shoeSoldPrice = "Зарагдсан үнийн дүн зөв байх ёстой";
      valid = false;
    } else if (parseFloat(shoeSoldPrice) > parseFloat(shoePrice)) {
      errors.shoeSoldPrice = "Зарагдсан үнэ үндсэн үнийн дүнгээс их байх ёсгүй";
      valid = false;
    }
    if (!buyerPhone || buyerPhone.length < 8) {
      errors.buyerPhone = "Утасны дугаар зөв байх ёстой";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const validateCheck = () => {
    let valid = true;
    let errors = {};

    if (!shoeCode) {
      errors.shoeCode = "Гутлын код оруулна уу";
      valid = false;
    }
    setErrors(errors);
    return valid;
  };

  const handleCheck = async () => {
    if (!validateCheck()) return;

    try {
      const shoeRef = doc(firestore, "shoes", shoeCode);
      const shoeDoc = await getDoc(shoeRef);

      if (!shoeDoc.exists()) {
        Alert.alert("Гутлын код олдсонгүй.");
      } else {
        const shoeData = shoeDoc.data();
        setShoeSize(shoeData.shoeSize);
        setShoePrice(shoeData.shoePrice);
        setDocumentId(shoeDoc.id);
        setShoeId(shoeDoc.id);
        setSelectedImage(shoeData.ImageUrl);

        // Force a re-render after setting the state
        setTimeout(() => {
          console.log(shoeSize, shoePrice);
        }, 0);
      }
    } catch (error) {
      console.error("Error checking shoe code: ", error);
      Alert.alert("Гутлын код шалгах явцад алдаа гарлаа.");
    }
  };

  const handleAddShoe = async () => {
    if (!validateForm()) return;

    try {
      const shoeRef = doc(firestore, "shoes", shoeCode);
      const shoeDoc = await getDoc(shoeRef);
      const shoeData = shoeDoc.data();

      const newSoldShoe = {
        shoeId: shoeDoc.id,
        shoeSize: shoeData.shoeSize,
        shoePrice: shoeData.shoePrice,
        soldPrice: shoeSoldPrice,
        buyerPhoneNumber: buyerPhone,
        transactionMethod: paymentMethod,
      };
      setSoldShoes([...soldShoes, newSoldShoe]);
      setTotalSalesCount(totalSalesCount + 1);
      setTotalAmount(totalAmount + parseFloat(shoeSoldPrice));

      setShoeCode("");
      setShoeSize("");
      setShoePrice("");
      setShoeSoldPrice("");
      setBuyerPhone("");
      setPaymentMethod("Шууд төлөлт");

      Alert.alert("Гутал амжилттай нэмэгдлээ!");
    } catch (error) {
      console.error("Гутал нэмэхэд алдаа гарлаа: ", error);
      Alert.alert("Гутал нэмэхэд алдаа гарлаа.");
    }
  };

  const handleSaveSales = async () => {
    try {
      const today = new Date();
      const salesDocID = `tuvSalbar${today.getFullYear()}${String(
        today.getMonth() + 1
      ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

      await setDoc(doc(firestore, "sales", salesDocID), {
        income: totalAmount,
        outcome: 0,
        totalAmount,
        totalSales: totalSalesCount,
        soldShoesList: soldShoes,
        comment: "",
      });

      const branchDocRef = doc(firestore, "branches", "tuvSalbar");
      await updateDoc(branchDocRef, {
        totalSales: increment(totalSalesCount),
        totalRevenue: increment(totalAmount),
        totalShoe: increment(-totalSalesCount),
      });

      Alert.alert("Орлого амжилттай хадгалагдлаа!");

      setSoldShoes([]);
      setTotalSalesCount(0);
      setTotalAmount(0);
    } catch (error) {
      console.error("Орлогыг хадгалахад алдаа гарлаа: ", error);
      Alert.alert("Орлогыг хадгалахад алдаа гарлаа.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, marginTop: "10%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <PaperTextInput
            style={styles.input}
            placeholder="Гутлын код"
            mode="outlined"
            value={shoeCode}
            maxLength={6}
            onChangeText={setShoeCode}
            error={!!errors.shoeCode} // Add error handling
          />

          <IconButton
            icon="magnify"
            size={20}
            iconColor="#697565"
            onPress={handleCheck}
            mode="outlined"
          />
        </View>

        {errors.shoeCode && (
          <PaperText style={styles.errorText}>{errors.shoeCode}</PaperText>
        )}
        <Divider style={styles.divider} />
        <View style={styles.row}>
          <PaperTextInput
            label="Размер"
            value={shoeSize}
            mode="outlined"
            style={[styles.input, { backgroundColor: "#f5ebe0" }]}
            editable={false}
          />
          <PaperTextInput
            label="Үнийн дүн"
            value={shoePrice}
            mode="outlined"
            style={[styles.input, { backgroundColor: "#f5ebe0" }]}
            editable={false}
          />
        </View>

        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        <Divider style={styles.divider} />

        <PaperTextInput
          placeholder="Зарагдсан үнэ"
          value={shoeSoldPrice}
          onChangeText={setShoeSoldPrice}
          mode="outlined"
          keyboardType="numeric"
          maxLength={7}
          style={styles.input}
          error={!!errors.shoeSoldPrice} // Add error handling
        />
        {errors.shoeSoldPrice && (
          <PaperText style={styles.errorText}>{errors.shoeSoldPrice}</PaperText>
        )}

        <PaperTextInput
          placeholder="Худалдан авагчийн утасны дугаар"
          value={buyerPhone}
          mode="outlined"
          onChangeText={setBuyerPhone}
          keyboardType="phone-pad"
          maxLength={8}
          style={styles.input}
          error={!!errors.buyerPhone} // Add error handling
        />
        {errors.buyerPhone && (
          <PaperText style={styles.errorText}>{errors.buyerPhone}</PaperText>
        )}

        <PaperText style={styles.label}>Төлбөрийн хэлбэр:</PaperText>
        <PaymentMethodSelector
          selectedMethod={paymentMethod}
          onSelect={(value) => setPaymentMethod(value)}
        />

        <CustomButton
          title="Гутал нэмэх"
          mode="contained"
          onPress={handleAddShoe}
          style={styles.button}
        >
          Орлого нэмэх
        </CustomButton>

        <View style={styles.summary}>
          <PaperText>
            Өнөөдрийн нийт зарсан гутлын тоо: {totalSalesCount}
          </PaperText>
          <PaperText>Өнөөдрийн нийт үнийн дүн: {totalAmount}</PaperText>
        </View>

        {soldShoes.map((shoe, index) => (
          <View key={index} style={styles.shoeItem}>
            <PaperText>Гутлын код: {shoe.shoeId}</PaperText>
            <PaperText>Размер: {shoe.shoeSize}</PaperText>
            <PaperText>Үндсэн үнэ: {shoe.shoePrice}</PaperText>
            <PaperText>Зарагдсан үнэ: {shoe.soldPrice}</PaperText>
            <PaperText>
              Худалдан авагчийн утас: {shoe.buyerPhoneNumber}
            </PaperText>
            <PaperText>Төлбөрийн хэлбэр: {shoe.transactionMethod}</PaperText>
          </View>
        ))}

        <CustomButton
          title="Орлогыг хадгалах"
          mode="contained"
          onPress={handleSaveSales}
          style={styles.button}
        >
          Орлогыг хадгалах
        </CustomButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFFBFF",
  },
  input: {
    flex: 1, // Make the input take up the remaining space
    marginEnd: 10,
    marginVertical: 10,
    backgroundColor: "transparent",
    width: "100%", // Full width input
    height: 35,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  label: {
    marginLeft: 18,
    margin: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  radio: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  summary: {
    marginTop: 20,
  },
  shoeItem: {
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
  },
  divider: {
    marginVertical: 5,
  },
});

export default RevenueReportScreen;
