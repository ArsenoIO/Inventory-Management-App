import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useRoute } from "@react-navigation/native";

const IncomeAddScreen = () => {
  const route = useRoute();
  const salesReport = route.params?.salesReport || {};
  const saleID = salesReport?.id;

  const [shoeCode, setShoeCode] = useState("");
  const [price, setPrice] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Хувь лизингийн нэмэлт талбарууд
  const [advancePayment, setAdvancePayment] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountOwner, setAccountOwner] = useState("");
  const [leasingNote, setLeasingNote] = useState("");

  const db = getFirestore();

  const handleIncomeSubmit = async () => {
    if (!shoeCode || !totalPrice || !paymentMethod) {
      alert("Талбаруудыг бөглөнө үү.");
      return;
    }

    try {
      // Гутал зарагдсан мэдээллийг шинэчлэх
      const shoeRef = doc(db, "shoes", shoeCode);
      await updateDoc(shoeRef, {
        isSold: true,
        buyerPhoneNumber: buyerPhone,
        soldPrice: totalPrice,
        soldDate: new Date(),
        transactionMethod: paymentMethod,
      });

      // Хэрэв хувь лизинг бол /leasing collection-д мэдээлэл оруулах
      if (paymentMethod === "Leasing") {
        const leasingData = {
          leasingDate: Timestamp.now(),
          shoeCode: shoeCode,
          advancePayment: advancePayment,
          buyerPhoneNumber: buyerPhone,
          accountNumber: accountNumber,
          accountOwner: accountOwner,
          leasingNote: leasingNote,
        };

        await addDoc(collection(db, "leasing"), leasingData);
      }

      alert("Орлого амжилттай нэмэгдлээ.");
      // Цэвэрлэх
      setShoeCode("");
      setPrice("");
      setBuyerPhone("");
      setTotalPrice("");
      setAdvancePayment("");
      setAccountNumber("");
      setAccountOwner("");
      setLeasingNote("");
    } catch (error) {
      console.error("Орлого нэмэхэд алдаа гарлаа:", error);
      alert("Орлого нэмэхэд алдаа гарлаа.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Бусад талбарууд */}
      <TextInput
        value={shoeCode}
        onChangeText={setShoeCode}
        style={styles.input}
        placeholder="Гутлын код"
      />
      <TextInput
        value={totalPrice}
        onChangeText={setTotalPrice}
        style={styles.input}
        placeholder="Зарагдах үнэ"
        keyboardType="numeric"
      />
      <TextInput
        value={buyerPhone}
        onChangeText={setBuyerPhone}
        style={styles.input}
        placeholder="Худалдан авагчийн дугаар"
        keyboardType="phone-pad"
      />

      <Text style={styles.paymentTitle}>Төлбөрийн хэлбэр:</Text>
      <View style={styles.paymentMethods}>
        <TouchableOpacity
          onPress={() => setPaymentMethod("Cash")}
          style={[
            styles.paymentButton,
            paymentMethod === "Cash" && styles.selectedPayment,
          ]}
        >
          <Text>Мөнгөн төлбөр</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPaymentMethod("Leasing")}
          style={[
            styles.paymentButton,
            paymentMethod === "Leasing" && styles.selectedPayment,
          ]}
        >
          <Text>Хувь лизинг</Text>
        </TouchableOpacity>
      </View>

      {/* Хувь лизинг сонгосон үед нэмэлт талбарууд */}
      {paymentMethod === "Leasing" && (
        <View>
          <TextInput
            value={advancePayment}
            onChangeText={setAdvancePayment}
            style={styles.input}
            placeholder="Урьдчилгаа төлбөр"
            keyboardType="numeric"
          />
          <TextInput
            value={accountNumber}
            onChangeText={setAccountNumber}
            style={styles.input}
            placeholder="Дансны дугаар"
            keyboardType="numeric"
          />
          <TextInput
            value={accountOwner}
            onChangeText={setAccountOwner}
            style={styles.input}
            placeholder="Данс эзэмшигчийн нэр"
          />
          <TextInput
            value={leasingNote}
            onChangeText={setLeasingNote}
            style={styles.input}
            placeholder="Тэмдэглэл"
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleIncomeSubmit}
        >
          <Text style={styles.buttonText}>Өнөөдрийн орлого-т нэмэх</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF",
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  paymentTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  paymentMethods: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  paymentButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
  },
  selectedPayment: {
    backgroundColor: "#F4BF96",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default IncomeAddScreen;
