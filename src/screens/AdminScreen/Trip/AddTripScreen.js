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
import { MaterialIcons } from "@expo/vector-icons"; // Importing icon

const AddTripScreen = ({ navigation }) => {
  const [tripDate, setTripDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startingBalance, setStartingBalance] = useState("");

  // Автоматаар үүсэх утгууд
  const remainingBalance = parseFloat(startingBalance) || 0;
  const shoeExpenses = 0;
  const otherExpenses = 0;
  const purchasedShoesCount = 0;
  const additionalNotes = "";

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleAddTrip}>
          <MaterialIcons
            name="save"
            size={24}
            color="black"
            style={{ marginRight: 16 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, tripDate, startingBalance]);

  // Огнооны сонголтын функц
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tripDate;
    setShowDatePicker(false);
    setTripDate(currentDate);
  };

  // Аяллыг Firestore-д хадгалах функц
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
        remainingBalance: remainingBalance, // Үлдэгдэл дүн
        shoeExpenses: shoeExpenses, // Гутлын зардал
        otherExpenses: otherExpenses, // Бусад зардал
        purchasedShoesCount: purchasedShoesCount, // Худалдан авсан гутлын тоо
        additionalNotes: additionalNotes, // Нэмэлт тэмдэглэл
      });
      Alert.alert("Амжилттай!", "Аялал амжилттай нэмэгдлээ.");
      navigation.goBack(); // Буцаж шилжих
    } catch (error) {
      Alert.alert("Аялал үүсгэхэд алдаа гарлаа!");
    }
  };

  // Setting up the save button in the header

  return (
    <View style={styles.container}>
      {/* Огноо сонгох */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.text}>
          Огноо сонгох: {tripDate.toLocaleString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={tripDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Эхлэх дүн оруулах */}
      <Text style={styles.text}>Эхлэх дүн:</Text>
      <TextInput
        style={styles.input}
        value={startingBalance}
        keyboardType="numeric"
        onChangeText={setStartingBalance}
        placeholder="Эхлэх дүн оруулна уу"
      />

      {/* Автоматаар үүсэх утгуудыг харуулах */}
      <View style={styles.readOnlyFields}>
        <Text style={styles.text}>Үлдэгдэл дүн: {remainingBalance}₮</Text>
        <Text style={styles.text}>Гутлын зардал: {shoeExpenses}₮</Text>
        <Text style={styles.text}>Бусад зардал: {otherExpenses}₮</Text>
        <Text style={styles.text}>
          Худалдан авсан гутал: {purchasedShoesCount}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
  },
  readOnlyFields: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  text: {
    fontSize: 17,
    margin: 5,
  },
});

export default AddTripScreen;
