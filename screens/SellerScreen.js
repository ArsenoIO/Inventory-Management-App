// SellerScreen.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Text,
  Alert,
} from "react-native";
import { firestore } from "../firebase";

export default function SellerScreen() {
  const [shoeName, setShoeName] = useState("");
  const [shoePrice, setShoePrice] = useState("");
  const [shoeColorSize, setShoeColorSize] = useState("");
  const [shoes, setShoes] = useState([]);

  const handleAddShoe = async () => {
    if (!shoeName || !shoePrice || !shoeColorSize) {
      Alert.alert("Алдаа", "Талбарыг бөглөнө үү!");
      return;
    }

    const newShoe = {
      name: shoeName,
      price: shoePrice,
      colorSize: shoeColorSize,
      dateAdded: new Date().toLocaleDateString(),
    };

    // Add to Firestore
    await firestore.collection("shoes").add(newShoe);

    // Update local state
    setShoes((prevShoes) => [
      ...prevShoes,
      { ...newShoe, id: Math.random().toString() },
    ]);
    setShoeName("");
    setShoePrice("");
    setShoeColorSize("");
    Alert.alert("Мэдээлэл", "Гутлыг амжилттай нэмлээ!");
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>Нэр: {item.name}</Text>
      <Text style={styles.itemText}>Үнэ: {item.price}</Text>
      <Text style={styles.itemText}>Өнгө/Хэмжээ: {item.colorSize}</Text>
      <Text style={styles.itemText}>Нэмсэн огноо: {item.dateAdded}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="КОД"
        value={shoeName}
        onChangeText={setShoeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Үнэ"
        value={shoePrice}
        onChangeText={setShoePrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Өнгө / Хэмжээ"
        value={shoeColorSize}
        onChangeText={setShoeColorSize}
      />
      <Button title="Нэмэх" onPress={handleAddShoe} />

      <FlatList
        data={shoes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.headerText}>Гутлын мэдээлэл</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  listHeader: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
