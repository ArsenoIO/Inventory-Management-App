import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons"; // Add this for the icon

const { width } = Dimensions.get("window");

const SupplierListScreen = ({ navigation }) => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const db = getFirestore();
      const suppliersCollection = collection(db, "names");
      const supplierSnapshot = await getDocs(suppliersCollection);

      const supplierList = supplierSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSuppliers(supplierList);
    };

    fetchSuppliers();
  }, []);

  const renderSupplierItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("SupplierDetailScreen", { supplierId: item.id })
      }
    >
      <View style={styles.columnLeft}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <Text style={styles.codeText}>{item.id}</Text>
      </View>
      <View style={styles.columnRight}>
        <Text style={styles.nameText}>{item.nameDetail}</Text>
        <Text style={styles.detailText}>Гутал: {item.totalShoes}</Text>
        <Text style={styles.detailText}>Үлдэгдэл: {item.balance}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={suppliers}
        renderItem={renderSupplierItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddSupplierScreen")}
      >
        <AntDesign name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: width * 0.03,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: width * 0.02,
    padding: width * 0.04,
    marginBottom: width * 0.03,
    elevation: 3,
  },
  columnLeft: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: width * 0.03,
  },
  image: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    marginBottom: width * 0.02,
  },
  placeholder: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: width * 0.02,
  },
  placeholderText: {
    fontSize: width * 0.035,
    color: "#777",
  },
  codeText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#333",
  },
  columnRight: {
    flex: 1,
    justifyContent: "center",
  },
  nameText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#000",
    marginBottom: width * 0.01,
  },
  detailText: {
    fontSize: width * 0.04,
    color: "#555",
  },
  addButton: {
    position: "absolute",
    right: width * 0.1,
    bottom: width * 0.1,
    backgroundColor: "#03A9F4",
    borderRadius: width * 0.035,
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.04,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
});

export default SupplierListScreen;
