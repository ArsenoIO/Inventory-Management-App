// ManagerScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { firestore } from "../firebase";

export default function ManagerScreen() {
  const [finance, setFinance] = useState(1000000); // Example initial finance
  const [purchases, setPurchases] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState({
    item: "",
    price: "",
    quantity: "",
    imageUrl: "",
  });

  const handleInputChange = (name, value) => {
    setPurchaseDetails({ ...purchaseDetails, [name]: value });
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleInputChange("imageUrl", result.uri);
    }
  };

  const handleAddPurchase = () => {
    const { item, price, quantity, imageUrl } = purchaseDetails;

    if (!item || !price || !quantity) {
      Alert.alert("Алдаа", "Талбарыг бөглөнө үү!");
      return;
    }

    const totalCost = parseInt(price) * parseInt(quantity);

    if (finance < totalCost) {
      Alert.alert("Алдаа", "Хангалттай мөнгө байхгүй!");
      return;
    }

    setFinance(finance - totalCost);

    const newPurchase = {
      id: Math.random().toString(),
      item,
      price,
      quantity,
      imageUrl,
      dateAdded: new Date().toLocaleDateString(),
    };

    setPurchases([...purchases, newPurchase]);
    setPurchaseDetails({ item: "", price: "", quantity: "", imageUrl: "" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Хувийн санхүү: ₮{finance}</Text>

      <TextInput
        style={styles.input}
        placeholder="Бараа"
        value={purchaseDetails.item}
        onChangeText={(text) => handleInputChange("item", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Үнэ"
        value={purchaseDetails.price}
        onChangeText={(text) => handleInputChange("price", text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Тоо"
        value={purchaseDetails.quantity}
        onChangeText={(text) => handleInputChange("quantity", text)}
        keyboardType="numeric"
      />

      <Button title="Зураг сонгох" onPress={handleImageUpload} />

      <Button title="Нэмэх" onPress={handleAddPurchase} />

      <FlatList
        data={purchases}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Бараа: {item.item}</Text>
            <Text>Үнэ: ₮{item.price}</Text>
            <Text>Тоо: {item.quantity}</Text>
            <Text>Нийт: ₮{item.price * item.quantity}</Text>
            <Text>Огноо: {item.dateAdded}</Text>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            ) : null}
          </View>
        )}
        keyExtractor={(item) => item.id}
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 8,
  },
});
