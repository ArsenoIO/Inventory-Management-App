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
import { doc, getDoc, collection, addDoc } from "firebase/firestore"; // Firestore-ийн үйлдлүүдийг импортлох

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

  const handleUpdateShoe = async () => {
    if (!shoeCode || !shoeSoldPrice || !buyerPhone) {
      Alert.alert("Бүх талбарыг бөглөнө үү.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    try {
      await addDoc(collection(firestore, "soldShoes"), {
        shoeCode,
        shoeSize,
        shoePrice,
        shoeSoldPrice,
        buyerPhone,
        paymentMethod,
        date: today,
      });

      Alert.alert("Гутлын мэдээлэл шинэчлэгдсэн.");

      setShoeCode("");
      setShoeSize("");
      setShoePrice("");
      setShoeSoldPrice("");
      setBuyerPhone("");
      setPaymentMethod("Шууд төлөлт");
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

    try {
      const shoeSnapshot = await getDoc(doc(firestore, "shoes", shoeCode));
      console.log(shoeSnapshot);
      if (!shoeSnapshot.exists()) {
        Alert.alert("Гутлын код олдсонгүй.");
        return;
      }

      const shoeData = shoeSnapshot.data();
      setShoeSize(shoeData.size);
      setShoePrice(shoeData.price);
      Alert.alert("Код шалгалаа.");
    } catch (error) {
      console.error("Error checking shoe code: ", error);
      Alert.alert("Гутлын код шалгахад алдаа гарлаа.");
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
            onChangeText={setShoeCode}
          />
          <IconButton
            icon="file"
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
