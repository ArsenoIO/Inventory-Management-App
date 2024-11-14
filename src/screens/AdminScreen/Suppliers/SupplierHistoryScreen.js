import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  getDoc,
  doc,
} from "firebase/firestore";

const { width, height } = Dimensions.get("window");

const SupplierHistoryScreen = ({ route }) => {
  const { supplierId } = route.params;
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // Төлбөрийн төрлийг шүүх төлөв

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

  const changePaymentMethod = async (expenseId, currentMethod) => {
    const newMethod =
      currentMethod === "paid"
        ? "credit"
        : currentMethod === "credit"
        ? "other"
        : "paid";

    try {
      const db = getFirestore();
      const expenseRef = doc(db, "shoeExpense", expenseId);
      const expenseSnap = await getDoc(expenseRef);

      if (expenseSnap.exists()) {
        const expenseData = expenseSnap.data();
        const supplierRef = doc(db, "names", expenseData.supplierCode);
        const supplierSnap = await getDoc(supplierRef);

        if (supplierSnap.exists()) {
          const supplierData = supplierSnap.data();
          let updatedBalance = supplierData.balance || 0;

          // Paid болон Credit төлвийн өөрчлөлтийн логик
          if (newMethod === "paid" && currentMethod !== "paid") {
            // Төлөв "paid" болж өөрчлөгдсөн тул баланс хасна
            updatedBalance -= expenseData.totalCost;
          } else if (newMethod === "credit" && currentMethod !== "credit") {
            // Төлөв "credit" болж өөрчлөгдсөн тул баланс нэмнэ
            updatedBalance += expenseData.totalCost;
          }

          // Баланс нь сөрөг утга болохоос сэргийлнэ
          updatedBalance = Math.max(0, updatedBalance);

          // Нийлүүлэгчийн өгөгдлийг шинэчлэх
          await updateDoc(supplierRef, { balance: updatedBalance });

          // Зардлын төлвийг шинэчлэх
          await updateDoc(expenseRef, { paymentMethod: newMethod });

          setExpenses((prevExpenses) =>
            prevExpenses.map((expense) =>
              expense.id === expenseId
                ? { ...expense, paymentMethod: newMethod }
                : expense
            )
          );
          Alert.alert("Амжилттай!", "Төлбөрийн төрлийг амжилттай шинэчиллээ.");
        } else {
          Alert.alert("Алдаа", "Нийлүүлэгчийн өгөгдөл олдсонгүй.");
        }
      } else {
        Alert.alert("Алдаа", "Зардлын өгөгдөл олдсонгүй.");
      }
    } catch (error) {
      console.error("Шинэчлэхэд алдаа гарлаа:", error);
      Alert.alert("Алдаа", "Төлбөрийн төрлийг шинэчлэхэд алдаа гарлаа.");
    }
  };

  const filteredExpenses =
    filter === "all"
      ? expenses
      : expenses.filter((expense) => expense.paymentMethod === filter);

  if (loading) {
    return <Text style={styles.loadingText}>Татаж байна...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {["all", "paid", "credit", "other"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              filter === type && styles.selectedFilterButton,
            ]}
            onPress={() => setFilter(type)}
          >
            <Text style={styles.filterText}>
              {type === "all"
                ? "Бүгд"
                : type === "paid"
                ? "Төлөгдсөн"
                : type === "credit"
                ? "Зээл"
                : "Бусад"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredExpenses}
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
            <Text style={styles.text}>Төлөлт: {item.paidAmount}</Text>
            <Text style={styles.textSus}>Тооцоо: {item.balanceAmount}</Text>
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  filterButton: {
    flex: 1,
    paddingVertical: height * 0.015,
    alignItems: "center",
    borderRadius: width * 0.02,
    backgroundColor: "#ddd",
    marginHorizontal: width * 0.01,
  },
  selectedFilterButton: {
    backgroundColor: "#03A9F4",
  },
  filterText: {
    color: "#333",
    fontSize: width * 0.04,
    fontWeight: "bold",
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
  textSus: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.01,
    color: "#CE5A67",
  },
  textPayment: {
    color: "#740938",
    fontSize: width * 0.045,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoText: {
    fontSize: width * 0.04,
    color: "#333",
    marginBottom: height * 0.01,
    alignSelf: "flex-end",
  },
  changeText: {
    color: "#03A9F4",
    fontSize: width * 0.035,
    textDecorationLine: "underline",
  },
});

export default SupplierHistoryScreen;
