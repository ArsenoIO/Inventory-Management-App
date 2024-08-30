import React, { useState, useEffect } from "react";
import {
  View,
  Image,
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

  const handleCheck = async () => {
    if (!shoeCode) {
      Alert.alert("Гутлын кодыг оруулна уу.");
      return;
    }

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
        Alert.alert("Код шалгалаа.");
      }
    } catch (error) {
      console.error("Error checking shoe code: ", error);
      Alert.alert("Гутлын код шалгах явцад алдаа гарлаа.");
    }
  };

  const handleAddShoe = async () => {
    if (!shoeCode || !shoeSoldPrice || !buyerPhone) {
      Alert.alert("Бүх талбарыг бөглөнө үү.");
      return;
    }

    try {
      const shoeRef = doc(firestore, "shoes", shoeCode);
      const shoeDoc = await getDoc(shoeRef);
      if (!shoeDoc.exists()) {
        Alert.alert("Гутлын код олдсонгүй.");
        return;
      }

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
            style={[styles.input, { height: 40 }]}
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
          <View style={styles.row}>
            <PaperTextInput
              style={[styles.input, { height: 40 }]}
              placeholder="Размер"
              value={shoeSize}
              editable={false}
            />
            <PaperTextInput
              style={[styles.input, { height: 40 }]}
              placeholder="Үнийн дүн"
              value={shoePrice}
              editable={false}
            />
          </View>
        ) : null}

        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

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
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
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
    marginTop: 20,
  },
});

export default RevenueReportScreen;
