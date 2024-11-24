import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const TripDetailScreen = ({ route, navigation }) => {
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);
  const [shoeExpenses, setShoeExpenses] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalShoeExpenses, setTotalShoeExpenses] = useState(0);
  const [totalOtherExpenses, setTotalOtherExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false); // For image modal
  const [selectedImage, setSelectedImage] = useState(null); // Track selected image
  const [refreshing, setRefreshing] = useState(false);
  const [filterBySupplier, setFilterBySupplier] = useState(""); // Нийлүүлэгчийн шүүлт
  const [sortByDate, setSortByDate] = useState("desc"); // Огноо эрэмбэлэх чиглэл (asc эсвэл desc)
  const [totalShoesCount, setTotalShoesCount] = useState(0);

  const fetchShoeExpenses = async () => {
    const db = getFirestore();
    const shoeExpenseQuery = query(
      collection(db, "shoeExpense"),
      where("tripId", "==", tripId),
      where("type", "==", "shoeExpense")
    );

    const shoeExpenseSnapshot = await getDocs(shoeExpenseQuery);
    const shoeExpenseList = shoeExpenseSnapshot.docs.map((doc) => ({
      id: doc.id, // Баримтын ID-г оруулах
      ...doc.data(),
    }));

    setShoeExpenses(shoeExpenseList);

    // Нийт зардал болон нийт гутлын тоог тооцоолох
    const totalShoeCost = shoeExpenseList.reduce(
      (acc, expense) => acc + parseFloat(expense.totalCost || 0),
      0
    );
    const totalShoes = shoeExpenseList.reduce(
      (acc, expense) => acc + parseInt(expense.purchasedShoesCount || 0, 10),
      0
    );

    setTotalShoeExpenses(totalShoeCost);
    setTotalShoesCount(totalShoes); // Нийт гутлын тоог state-д хадгалах
  };

  const filteredAndSortedExpenses = () => {
    let filteredExpenses = shoeExpenses;

    // Нийлүүлэгчээр шүүх
    if (filterBySupplier) {
      filteredExpenses = filteredExpenses.filter(
        (expense) =>
          expense.supplierCode &&
          expense.supplierCode.includes(filterBySupplier)
      );
    }

    // Огноогоор эрэмбэлэх
    filteredExpenses.sort((a, b) => {
      if (sortByDate === "asc") {
        return a.createdAt - b.createdAt; // Хамгийн эртнийг эхэнд
      } else {
        return b.createdAt - a.createdAt; // Хамгийн сүүлийг эхэнд
      }
    });

    return filteredExpenses;
  };

  const fetchTripDetails = async () => {
    const db = getFirestore();
    const tripRef = doc(db, "trips", tripId);
    const tripSnap = await getDoc(tripRef);

    if (tripSnap.exists()) {
      setTrip(tripSnap.data());
      fetchOtherExpenses();
      fetchShoeExpenses();
    } else {
      Alert.alert("Алдаа", "Аяллын дэлгэрэнгүй мэдээлэл олдсонгүй.");
      navigation.goBack();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTripDetails();
    setRefreshing(false);
  };

  const fetchOtherExpenses = async () => {
    const db = getFirestore();
    const expenseQuery = query(
      collection(db, "otherExpense"),
      where("tripID", "==", tripId),
      where("type", "==", "otherExpense")
    );

    const expenseSnapshot = await getDocs(expenseQuery);
    const expenseList = expenseSnapshot.docs.map((doc) => ({
      id: doc.id, // Баримтын ID-г оруулах
      ...doc.data(),
    }));
    setExpenses(expenseList);
    const totalExpenses = expenseList.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    setTotalOtherExpenses(totalExpenses);
    setLoading(false);
  };

  useEffect(() => {
    fetchTripDetails();
  }, [tripId, navigation]);

  if (loading) {
    return <Text style={styles.loadingText}>Ачааллаж байна...</Text>;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>
          Нийт гутлын тоо: {totalShoesCount}
        </Text>
      </View>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Нийлүүлэгчийн нэрээр хайх"
          value={filterBySupplier}
          onChangeText={(text) => setFilterBySupplier(text)}
        />
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() =>
            setSortByDate((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          <MaterialIcons
            name={sortByDate === "asc" ? "arrow-upward" : "arrow-downward"}
            size={24}
            color="#333"
          />
          <Text style={styles.sortButtonText}>
            {sortByDate === "asc" ? "Эртнийг эхэнд" : "Сүүлийг эхэнд"}
          </Text>
        </TouchableOpacity>
      </View>

      {filteredAndSortedExpenses().map((expense, index) => (
        <View key={index} style={styles.shoeExpenseCard}>
          <Text style={styles.expenseDetail}>
            Код: {expense.supplierCode} | Тоо: {expense.purchasedShoesCount}
          </Text>
          <Text style={styles.expenseDetail}>
            Үнэ: {expense.shoeExpense} | Нийт үнэ: {expense.totalCost} |
          </Text>
          <Text style={styles.expenseDetail}>
            Огноо:{" "}
            {new Date(expense.createdAt.seconds * 1000).toLocaleDateString()}
          </Text>
          {expense.image && (
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(expense.image);
                setImageModalVisible(true);
              }}
            >
              <Image source={{ uri: expense.image }} style={styles.image} />
            </TouchableOpacity>
          )}
        </View>
      ))}

      {/*
      <View style={styles.expenseSection}>
        <Text style={styles.sectionTitle}>Гутлын жагсаалт:</Text>

        {shoeExpenses.map((expense, index) => (
          <View key={index} style={styles.shoeExpenseCard}>
            <Text style={styles.expenseDetail}>
              Код: {expense.supplierCode} | Тоо: {expense.purchasedShoesCount}
            </Text>
            <Text style={styles.expenseDetail}>
              Үнэ: {expense.shoeExpense} | Нийт үнэ: {expense.totalCost}
            </Text>
            {expense.image && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedImage(expense.image);
                  setImageModalVisible(true);
                }}
              >
                <Image source={{ uri: expense.image }} style={styles.image} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
*/}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.imageModalContainer}
          onPress={() => setImageModalVisible(false)}
        >
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.04,
    flexGrow: 1,
    backgroundColor: "#f2f2f2",
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#243642",
    marginVertical: height * 0.02,
    alignSelf: "flex-start",
  },
  expenseText: {
    fontSize: width * 0.04,
    color: "#333",
    marginBottom: height * 0.005,
  },
  shoeExpenseCard: {
    backgroundColor: "#ffffff",
    padding: width * 0.04,
    borderRadius: width * 0.03,
    marginBottom: height * 0.02,
    elevation: 2,
    borderRightWidth: 4,
    borderRightColor: "#03A9F4",
  },
  expenseDetail: {
    fontSize: width * 0.04,
    marginBottom: height * 0.005,
  },
  image: {
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: width * 0.02,
    marginTop: height * 0.01,
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    textAlign: "center",
    marginTop: height * 0.05,
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  summarySection: {
    padding: width * 0.04,
    backgroundColor: "#fff",
    borderRadius: width * 0.03,
    marginBottom: height * 0.02,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.01,
  },
});

export default TripDetailScreen;
