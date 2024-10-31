import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const AddOtherExpenseScreen = ({ route, navigation }) => {
  const { tripId } = route.params; // Аяллын ID
  const [amount, setAmount] = useState(""); // Зардлын мөнгөн дүн
  const [note, setNote] = useState(""); // Тэмдэглэл

  const handleAddExpense = async () => {
    if (!amount) {
      Alert.alert("Алдаа", "Зардлын мөнгөн дүнг оруулна уу.");
      return;
    }

    try {
      const db = getFirestore();
      const expenseRef = collection(db, "otherExpense");

      await addDoc(expenseRef, {
        tripID: tripId,
        amount: parseFloat(amount),
        note: note || "Бусад зардал",
        createdAt: new Date().getTime(),
        type: "otherExpense",
      });

      Alert.alert("Амжилттай", "Зардал амжилттай нэмэгдлээ.");
      navigation.goBack();
    } catch (error) {
      console.error("Зардал нэмэхэд алдаа гарлаа: ", error);
      Alert.alert("Алдаа", "Зардал нэмэхэд алдаа гарлаа.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Зардлын мөнгөн дүн:</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Мөнгөн дүнг оруулна уу"
      />

      <Text style={styles.label}>Тэмдэглэл:</Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        placeholder="Тэмдэглэл оруулах"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
        <Text style={styles.buttonText}>Зардал нэмэх</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  addButton: {
    backgroundColor: "#03A9F4",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddOtherExpenseScreen;
