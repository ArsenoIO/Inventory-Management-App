import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
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
} from "react-native-paper";
import Button from "../components/Button"; // Custom Button component
import { firestore, auth } from "../firebaseConfig"; // Firebase firestore болон auth-ийн холбоос
import { doc, getDoc, collection, updateDoc, query, where, getDocs } from "firebase/firestore"; // Firestore-ийн үйлдлүүдийг импортлох

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
  const [documentId, setDocumentId] = useState(""); // Шинэ утга оруулах эсэхийг тодорхойлох

  // Нэвтэрсэн хэрэглэгчийн мэдээллийг татаж авах
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

  const handleUpdateShoe = async () => {
    if (!shoeCode || !shoeSoldPrice || !buyerPhone) {
      Alert.alert("Бүх талбарыг бөглөнө үү.");
      return;
    }

    try {
      if (!documentId) {
        Alert.alert("Гутлын код шалгаж, мэдээллийг бүрэн бөглөнө үү.");
        return;
      }

      const shoeRef = doc(firestore, "shoes", documentId);

      await updateDoc(shoeRef, {
        shoeSoldPrice,
        buyerPhone,
        paymentMethod,
        shoeSoldDate: new Date(),
        soldUserID: userData ? userData.name : "",
        isTransaction: paymentMethod === "Шууд төлөлт",
        isTransactionStorepay: paymentMethod === "Storepay",
        isTransactionPocket: paymentMethod === "Pocket",
        isTransactionLendpay: paymentMethod === "Lend",
        isTransactionLeesing: paymentMethod === "Leasing",
      });

      Alert.alert("Гутлын мэдээлэл шинэчлэгдсэн.");

      setShoeCode("");
      setShoeSize("");
      setShoePrice("");
      setShoeSoldPrice("");
      setBuyerPhone("");
      setPaymentMethod("Шууд төлөлт");
      setDocumentId(""); // Шинэ гутал нэмэх боломжтой болгоно

      fetchSoldShoes(); // Зарагдсан гутлын жагсаалтыг шинэчлэх
    } catch (error) {
      console.error("Error updating shoe: ", error);
      Alert.alert("Гутлын мэдээллийг шинэчлэхэд алдаа гарлаа.");
    }
  };

  const handleCheck = async () => {
    if (!shoeCode) {
      Alert.alert("Гутлын кодыг оруулна уу.");
      return;
    }
  
    const shoesRef = collection(firestore, "shoes");
    const q = query(shoesRef, where("shoeCode", "==", shoeCode));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      Alert.alert("Гутлын код олдсонгүй.");
    } else {
      querySnapshot.forEach((doc) => {
        const shoeData = doc.data();
        setShoeSize(shoeData.size);
        setShoePrice(shoeData.price);
        setDocumentId(doc.id); // Шалгасан баримтын ID-г хадгална
        Alert.alert("Код шалгалаа.");
      });
    }
  };

  // Өнөөдрийн зарагдсан гутлуудыг татах функц
  const fetchSoldShoes = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Өнөөдөр өглөөний 00:00 цаг
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Маргаашийн 00:00 цаг

      const shoeRef = collection(firestore, "shoes");
      const q = query(
        shoeRef,
        where("shoeSoldDate", ">=", today),
        where("shoeSoldDate", "<", tomorrow)
      );
      const querySnapshot = await getDocs(q);

      const soldShoesList = [];
      let totalAmount = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        soldShoesList.push(data);
        totalAmount += parseFloat(data.shoeSoldPrice || 0);
      });

      setSoldShoes(soldShoesList);
      setTotalSalesCount(soldShoesList.length);
      setTotalAmount(totalAmount);
    } catch (error) {
      console.error("Error fetching sold shoes: ", error);
      Alert.alert("Зарагдсан гутлын мэдээллийг татахад алдаа гарлаа.");
    }
  };

  useEffect(() => {
    fetchSoldShoes(); // Экран ачаалахад зарагдсан гутлуудыг татах
  }, []);

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
            onChangeText={setShoeCode}
          />
          <IconButton
            icon="magnify"
            size={35}
            iconColor="#697565"
            onPress={handleCheck}
            mode="outlined"
          />
        </View>

        {shoeSize && shoePrice ? (
          <View style={styles.input}>
            <PaperTextInput
              style={styles.input}
              placeholder="Размер"
              value={shoeSize}
              editable={false}
            />
            <PaperTextInput
              style={styles.input}
              placeholder="Үнийн дүн"
              value={shoePrice}
              editable={false}
            />
          </View>
        ) : null}
        <View>
          <PaperTextInput
            placeholder="Зарагдсан үнэ"
            value={shoeSoldPrice}
            onChangeText={setShoeSoldPrice}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View>
          <PaperTextInput
            placeholder="Худалдан авагчийн утасны дугаар"
            value={buyerPhone}
            mode="outlined"
            onChangeText={setBuyerPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>
        <View>
          <PaperText style={styles.label}>Төлбөрийн арга:</PaperText>
        </View>

        <View style={styles.row}>
          <RadioButton.Group
            onValueChange={(value) => setPaymentMethod(value)}
            value={paymentMethod}
          >
            <View style={styles.radio}>
              <RadioButton value="Шууд төлөлт" />
              <PaperText>Шууд төлөлт</PaperText>
            </View>
            <View style={styles.radio}>
              <RadioButton value="Storepay" />
              <PaperText>Storepay</PaperText>
            </View>
            <View style={styles.radio}>
              <RadioButton value="Pocket" />
              <PaperText>Pocket</PaperText>
            </View>
            <View style={styles.radio}>
              <RadioButton value="Lend" />
              <PaperText>Lend</PaperText>
            </View>
            <View style={styles.radio}>
              <RadioButton value="Leasing" />
              <PaperText>Leasing</PaperText>
            </View>
          </RadioButton.Group>
        </View>

        <Button
          title="Гутлын мэдээллийг шинэчлэх"
          onPress={handleUpdateShoe}
          style={styles.button}
        />

        <View style={styles.summary}>
          <PaperText>
            Өнөөдрийн нийт зарсан гутлын тоо: {totalSalesCount}
          </PaperText>
          <PaperText>Өнөөдрийн нийт үнийн дүн: {totalAmount}</PaperText>
        </View>

        {soldShoes.map((shoe, index) => (
          <View key={index} style={styles.shoeItem}>
            <PaperText>Гутлын код: {shoe.shoeCode}</PaperText>
            <PaperText>Размер: {shoe.size}</PaperText>
            <PaperText>Үндсэн үнэ: {shoe.price}</PaperText>
            <PaperText>Зарагдсан үнэ: {shoe.shoeSoldPrice}</PaperText>
            <PaperText>Худалдан авагчийн утас: {shoe.buyerPhone}</PaperText>
            <PaperText>Төлбөрийн хэлбэр: {shoe.paymentMethod}</PaperText>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    margin: 10,
    height: 50,
  },
  label: {
    flex: 1,
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
    backgroundColor: "#CE5A67", // Товчлуурын өнгийг тохируулах
    width: 150, // хүссэн хэмжээгээр өөрчлөх
    alignSelf: "center", // төвд байрлуулах
  },
});

export default RevenueReportScreen;
