import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

const AddTripScreen = ({ navigation }) => {
  const [tripDate, setTripDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startingBalance, setStartingBalance] = useState("");
  const [status, setStatus] = useState("active"); // Төлөвийг анхдагчаар идэвхтэй болгох
  const [exchangeRate, setExchangeRate] = useState(""); // Ханшийн state үүсгэх

  const remainingBalance = parseFloat(startingBalance) || 0;
  const shoeExpenses = 0;
  const otherExpenses = 0;
  const purchasedShoesCount = 0;
  const additionalNotes = "";

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleAddTrip} style={styles.saveButton}>
          <MaterialIcons name="save" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, tripDate, startingBalance, status]);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tripDate;
    setShowDatePicker(false);
    setTripDate(currentDate);
  };

  const handleAddTrip = async () => {
    if (!startingBalance) {
      Alert.alert("Дүнгээ оруулна уу!!");
      return;
    }
    try {
      const db = getFirestore();
      await addDoc(collection(db, "trips"), {
        tripDate: tripDate.getTime(),
        startingBalance: parseFloat(startingBalance),
        exchangeRate: parseFloat(exchangeRate) || 0, // Ханшийг хадгална

        remainingBalance: remainingBalance,
        shoeExpenses: shoeExpenses,
        otherExpenses: otherExpenses,
        purchasedShoesCount: purchasedShoesCount,
        additionalNotes: additionalNotes,
        status: status, // Төлөвийг хадгална
      });
      Alert.alert("Амжилттай!", "Аялал амжилттай нэмэгдлээ.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Аялал үүсгэхэд алдаа гарлаа!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Аяллын огноо:</Text>
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>{tripDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={tripDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.label}>Эхлэх дүн:</Text>
      <TextInput
        style={styles.input}
        value={startingBalance}
        keyboardType="numeric"
        onChangeText={setStartingBalance}
        placeholder="Эхлэх дүн оруулна уу"
      />

      {/* Ханш оруулах */}
      <Text style={styles.label}>Ханш:</Text>
      <TextInput
        style={styles.input}
        value={exchangeRate}
        keyboardType="numeric"
        onChangeText={setExchangeRate}
        placeholder="Ханш оруулна уу"
      />

      <View style={styles.readOnlyContainer}>
        <Text style={styles.readOnlyLabel}>Автоматаар үүсэх утгууд:</Text>
        <Text style={styles.readOnlyText}>
          Үлдэгдэл дүн: {remainingBalance}
        </Text>
        <Text style={styles.readOnlyText}>Гутлын зардал: {shoeExpenses}</Text>
        <Text style={styles.readOnlyText}>Бусад зардал: {otherExpenses}</Text>
        <Text style={styles.readOnlyText}>
          Худалдан авсан гутал: {purchasedShoesCount}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF",
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  datePicker: {
    backgroundColor: "#e0f7fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#00796b",
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  readOnlyContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f1f8e9",
  },
  readOnlyLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#388e3c",
  },
  readOnlyText: {
    fontSize: 16,
    marginVertical: 3,
    color: "#455a64",
  },
});

export default AddTripScreen;
