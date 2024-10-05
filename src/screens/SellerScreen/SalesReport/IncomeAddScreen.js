import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  collection,
  addDoc,
} from "firebase/firestore";
import { getDocs, query, where } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import useUserData from "../../../hooks/useUserData";

const IncomeAddScreen = () => {
  const { userData, loading: userLoading, error } = useUserData(); // Custom hook ашиглаж байна
  const navigation = useNavigation();
  const route = useRoute();
  const salesReport = route.params?.salesReport || {}; // Ensure salesReport exists
  const saleID = salesReport?.id; // Extract saleID

  const [shoeCode, setShoeCode] = useState("");
  const [shoeData, setShoeData] = useState(null); // Гутлын мэдээллийг хадгалах
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const db = getFirestore();

  // Хувь лизингийн нэмэлт талбарууд
  const [advancePayment, setAdvancePayment] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountOwner, setAccountOwner] = useState("");
  const [leasingNote, setLeasingNote] = useState("");

  const handleSearch = async () => {
    if (!shoeCode) return;

    try {
      const shoeDoc = await getDoc(doc(db, "shoes", shoeCode));

      if (shoeDoc.exists()) {
        const shoe = shoeDoc.data();
        setShoeData(shoe);
        setPrice(shoe.shoePrice);
        setSize(shoe.shoeSize);
      } else {
        alert("Гутал олдсонгүй");
      }
    } catch (error) {
      console.error("Гутлын мэдээлэл авахад алдаа гарлаа:", error);
    }
  };

  const handleIncomeSubmit = async () => {
    if (!shoeData) {
      alert("Гутлын мэдээлэл байхгүй байна.");
      return;
    }

    if (!saleID) {
      alert("Тайлангийн ID олдсонгүй. Орлогыг бүртгэх боломжгүй.");
      return;
    }

    try {
      const db = getFirestore();

      // Updating shoe details
      const shoeRef = doc(db, "shoes", shoeCode);
      await updateDoc(shoeRef, {
        isSold: true,
        buyerPhoneNumber: buyerPhone,
        soldPrice: totalPrice,
        soldDate: new Date(),
        transactionMethod: paymentMethod,
      });

      // Adding to salesDetail
      const salesDetailRef = collection(db, "salesDetail");
      await addDoc(salesDetailRef, {
        saleID,
        shoeCode: shoeCode,
        soldPrice: totalPrice,
      });

      // Updating the salesReport income and recalculating totalIncome
      const reportRef = doc(db, "salesReport", saleID);
      const reportDoc = await getDoc(reportRef);
      if (reportDoc.exists()) {
        const currentReport = reportDoc.data();
        const updatedIncome = currentReport.income + parseFloat(totalPrice); // Update income
        const updatedTotalIncome = updatedIncome - currentReport.expenses; // Calculate totalIncome

        await updateDoc(reportRef, {
          income: updatedIncome,
          totalIncome: updatedTotalIncome,
          totalSales: currentReport.totalSales + 1,
        });
      }

      alert("Орлого амжилттай нэмэгдлээ.");

      // Reset fields
      setShoeCode("");
      setShoeData(null);
      setPrice("");
      setSize("");
      setBuyerPhone("");
      setTotalPrice("");
      setPaymentMethod("");
      navigation.goBack();
    } catch (error) {
      console.error("Орлого нэмэхэд алдаа гарлаа:", error);
      alert("Орлого нэмэхэд алдаа гарлаа.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Гутлын код оруулна уу..."
          value={shoeCode}
          onChangeText={setShoeCode}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Гутлын зураг болон мэдээлэл */}
      <View style={styles.shoeInfoContainer}>
        <View style={styles.imageContainer}>
          {shoeData ? (
            <Image
              source={{ uri: shoeData.ImageUrl }}
              style={styles.shoeImage}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Гутлын зураг</Text>
            </View>
          )}
        </View>
        <View style={styles.infoContainer}>
          <TextInput
            value={size}
            onChangeText={setSize}
            style={styles.input}
            placeholder="Размер"
            editable={false}
          />
          <TextInput
            value={price}
            onChangeText={setPrice}
            style={styles.input}
            placeholder="Үнэ"
            editable={false}
          />
        </View>
      </View>

      <TextInput
        value={totalPrice}
        onChangeText={setTotalPrice}
        style={styles.input}
        placeholder="Зарагдах буй үнэ"
        keyboardType="numeric"
      />
      <TextInput
        value={buyerPhone}
        onChangeText={setBuyerPhone}
        style={styles.input}
        placeholder="Худалдан авагчийн утасны дугаар"
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
          <Text>Шууд мөнгө</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPaymentMethod("Storepay")}
          style={[
            styles.paymentButton,
            paymentMethod === "Storepay" && styles.selectedPayment,
          ]}
        >
          <Text>Storepay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPaymentMethod("Pocket")}
          style={[
            styles.paymentButton,
            paymentMethod === "Pocket" && styles.selectedPayment,
          ]}
        >
          <Text>Pocket</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPaymentMethod("LendPay")}
          style={[
            styles.paymentButton,
            paymentMethod === "LendPay" && styles.selectedPayment,
          ]}
        >
          <Text>LendPay</Text>
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

      {/* Хувь лизингийн нэмэлт талбаруудыг босоо байрлалтай болгох */}
      {paymentMethod === "Leasing" && (
        <View style={styles.leasingContainer}>
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
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.buttonText}>Цуцлах</Text>
        </TouchableOpacity>
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
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 20,
    paddingRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  searchIcon: {
    padding: 5,
  },
  shoeInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  imageContainer: {
    width: 150,
    height: 180,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    borderStyle: "dashed", // Тасархай зураастай хүрээ
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#aaa",
    fontSize: 14,
  },
  shoeImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  infoContainer: {
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
    flexDirection: "column",
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
  cancelButton: {
    flex: 1,
    backgroundColor: "#FF6969",
    padding: 15,
    borderRadius: 5,
    marginRight: 10,
    alignItems: "center",
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
  leasingContainer: {
    marginVertical: 10, // Талбаруудын хооронд зай нэмэх
  },
});

export default IncomeAddScreen;
