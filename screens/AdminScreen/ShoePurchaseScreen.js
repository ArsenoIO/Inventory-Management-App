import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const ShoePurchaseScreen = ({ navigation }) => {
  const [supplier, setSupplier] = useState("");
  const [shoesCount, setShoesCount] = useState("");
  const [price, setPrice] = useState("");

  const handleSave = () => {
    // Оруулах утгуудыг хадгалах логик энд хийнэ
    const totalCost = parseFloat(price) * parseInt(shoesCount);
    console.log("Гутал нийлүүлэгч:", supplier);
    console.log("Гутал тоо:", shoesCount);
    console.log("Нийт зардал:", totalCost);

    // Буцаад өмнөх дэлгэц рүү шилжих
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Гутал худалдан авах</Text>

      <Text>Нийлүүлэгчийн нэр:</Text>
      <TextInput
        style={styles.input}
        placeholder="Нийлүүлэгчийн нэр"
        value={supplier}
        onChangeText={setSupplier}
      />

      <Text>Гутлын тоо:</Text>
      <TextInput
        style={styles.input}
        placeholder="Гутлын тоо"
        value={shoesCount}
        onChangeText={setShoesCount}
        keyboardType="numeric"
      />

      <Text>Гутлын үнэ:</Text>
      <TextInput
        style={styles.input}
        placeholder="Гутлын нэгж үнэ"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Болих"
          onPress={() => navigation.goBack()}
          color="#CE5A67"
        />
        <Button title="Хадгалах" onPress={handleSave} color="#28a745" />
      </View>
    </View>
  );
};

export default ShoePurchaseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FCF5ED",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#CE5A67",
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
