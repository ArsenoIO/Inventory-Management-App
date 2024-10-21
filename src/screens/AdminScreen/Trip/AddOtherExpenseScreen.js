import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const AddOtherExpenseScreen = ({ route, navigation }) => {
  const { tripId } = route.params; // Аяллын ID
  const [amount, setAmount] = useState(""); // Зардлын мөнгөн дүн
  const [note, setNote] = useState(""); // Тэмдэглэл

  // Зардлыг Firestore-д хадгалах функц
  const handleAddExpense = async () => {
    if (!amount) {
      Alert.alert("Алдаа", "Зардлын мөнгөн дүнг оруулна уу.");
      return;
    }

    try {
      const db = getFirestore();
      const expenseRef = collection(db, "otherExpense");

      // Firestore-д зардлыг хадгалах
      await addDoc(expenseRef, {
        tripID: tripId, // Тухайн аяллын ID
        amount: parseFloat(amount), // Зардлын мөнгөн дүн
        note: note || "Бусад зардал", // Тэмдэглэл (default: Бусад зардал)
        createdAt: new Date().getTime(), // Зардал үүсгэсэн огноо
        type: "otherExpense", // Type of the expense
      });

      Alert.alert("Амжилттай", "Зардал амжилттай нэмэгдлээ.");
      navigation.goBack(); // Буцаж шилжих
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
      />

      <Text style={styles.label}>Тэмдэглэл:</Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        placeholder="Тэмдэглэл оруулах"
      />

      <Button title="Зардал нэмэх" onPress={handleAddExpense} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
});

export default AddOtherExpenseScreen;
