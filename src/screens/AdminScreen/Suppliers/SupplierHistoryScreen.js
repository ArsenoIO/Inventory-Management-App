import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const { width, height } = Dimensions.get("window");

const SupplierHistoryScreen = ({ route }) => {
  const { supplierId } = route.params;
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplierExpenses = async () => {
      try {
        const db = getFirestore();
        const expensesQuery = query(
          collection(db, "shoeExpense"),
          where("supplierCode", "==", supplierId)
        );
        const querySnapshot = await getDocs(expensesQuery);
        const expenseData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(expenseData);
        setLoading(false);
      } catch (error) {
        console.error("Өгөгдлийг татахад алдаа гарлаа:", error);
        Alert.alert("Алдаа", "Өгөгдлийг татахад алдаа гарлаа.");
      }
    };

    fetchSupplierExpenses();
  }, [supplierId]);

  if (loading) {
    return <Text style={styles.loadingText}>Татаж байна...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}
            <Text style={styles.text}>
              Гутлын тоо: {item.purchasedShoesCount}
            </Text>
            <Text style={styles.text}>Нэгж үнэ: {item.shoeExpense}</Text>
            <Text style={styles.text}>Нийт үнэ: {item.totalCost}</Text>
            <Text style={styles.text}>
              Төлбөрийн төрөл: {item.paymentMethod}
            </Text>
            <Text style={styles.text}>Тэмдэглэл: {item.additionalNotes}</Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Огноо:</Text>{" "}
              {item.createdAt instanceof Date
                ? item.createdAt.toLocaleDateString()
                : new Date(
                    item.createdAt?.seconds * 1000 || item.createdAt
                  ).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.04,
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  loadingText: {
    fontSize: width * 0.05,
    textAlign: "center",
    marginTop: height * 0.1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: width * 0.03,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: height * 0.4,
    borderRadius: width * 0.03,
    marginBottom: height * 0.015,
  },
  text: {
    fontSize: width * 0.04,
    color: "#333",
    marginBottom: height * 0.01,
  },
  infoText: {
    fontSize: width * 0.04,
    color: "#333",
    marginBottom: height * 0.01,
    alignSelf: "flex-end",
  },
});

export default SupplierHistoryScreen;
