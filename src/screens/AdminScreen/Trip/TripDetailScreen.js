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
import { AntDesign } from "@expo/vector-icons";
import AddBalanceModal from "../../../components/Modal/AddBalanceModal";
import AddExpenseModal from "../../../components/Modal/AddExpenseModal"; // Import the new modal

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
  const [addBalanceModalVisible, setAddBalanceModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false); // For image modal
  const [paidAmount, setPaidAmount] = useState();
  const [selectedImage, setSelectedImage] = useState(null); // Track selected image
  const [refreshing, setRefreshing] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [addExpenseModalVisible, setAddExpenseModalVisible] = useState(false);

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
    const totalShoeCost = shoeExpenseList.reduce(
      (acc, expense) => acc + parseFloat(expense.totalCost || 0),
      0
    );
    const totalPaidAmount = shoeExpenseList.reduce(
      (acc, expense) => acc + parseFloat(expense.paidAmount || 0),
      0
    );
    setPaidAmount(totalPaidAmount);
    setTotalShoeExpenses(totalShoeCost);
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
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setAddExpenseModalVisible(true)}>
          <AntDesign
            name="pluscircle"
            size={30}
            color="#03A9F4"
            style={{ marginRight: 16 }}
          />
        </TouchableOpacity>
      ),
    });
    fetchTripDetails();
  }, [tripId, navigation]);

  const calculateRemainingBalance = () => {
    if (!trip) return 0;
    return trip.startingBalance - (paidAmount + totalOtherExpenses);
  };

  const handleExpenseSelection = (type) => {
    setModalVisible(false);
    if (type === "otherExpense") {
      navigation.navigate("AddOtherExpenseScreen", { tripId });
    } else if (type === "shoeExpense") {
      navigation.navigate("AddShoeExpenseScreen", { tripId });
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      const db = getFirestore();
      const tripRef = doc(db, "trips", tripId);
      await deleteDoc(tripRef);
      Alert.alert("Амжилттай!", "Аялал болон холбогдох зардлууд устгагдлаа.");
      setConfirmModalVisible(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Алдаа", "Аяллыг устгахад алдаа гарлаа.");
      console.log(error);
    }
  };

  const handleDeleteTrip = () => {
    setConfirmModalVisible(true);
  };

  const handleDeleteSingleExpense = (expenseId, collectionName) => {
    Alert.alert(
      "Баталгаажуулалт",
      "Та энэ зардлыг устгахдаа итгэлтэй байна уу?",
      [
        {
          text: "Үгүй",
          style: "cancel",
        },
        {
          text: "Тийм",
          onPress: async () => {
            try {
              const db = getFirestore();
              const expenseRef = doc(db, collectionName, expenseId);
              const expenseSnap = await getDoc(expenseRef);

              if (expenseSnap.exists()) {
                const expenseData = expenseSnap.data();
                const supplierCode = expenseData.supplierCode;
                const purchasedShoesCount = expenseData.purchasedShoesCount;
                const totalCost = expenseData.totalCost;

                // Нийлүүлэгчийн мэдээллийг татаж авах
                const supplierRef = doc(db, "names", supplierCode);
                const supplierSnap = await getDoc(supplierRef);

                if (supplierSnap.exists()) {
                  const supplierData = supplierSnap.data();
                  const updatedTotalShoes =
                    (supplierData.totalShoes || 0) - purchasedShoesCount;
                  const updatedBalance =
                    (supplierData.balance || 0) - totalCost;

                  // Нийлүүлэгчийн мэдээллийг шинэчлэх
                  await updateDoc(supplierRef, {
                    totalShoes: updatedTotalShoes >= 0 ? updatedTotalShoes : 0, // Сөрөг тооноос сэргийлэх
                    balance: updatedBalance >= 0 ? updatedBalance : 0, // Сөрөг тооноос сэргийлэх
                  });
                }

                // Зардлыг устгах
                await deleteDoc(expenseRef);
                Alert.alert("Амжилттай!", "Зардал амжилттай устгагдлаа.");

                fetchShoeExpenses();
                fetchOtherExpenses();
              } else {
                Alert.alert("Алдаа", "Зардлын өгөгдөл олдсонгүй.");
              }
            } catch (error) {
              console.error("Устгалтын алдаа гарлаа:", error);
              Alert.alert("Алдаа", "Зардлыг устгахад алдаа гарлаа.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteOtherExpense = async (expenseId) => {
    Alert.alert(
      "Баталгаажуулалт",
      "Та энэ зардлыг устгахдаа итгэлтэй байна уу?",
      [
        {
          text: "Үгүй",
          style: "cancel",
        },
        {
          text: "Тийм",
          onPress: async () => {
            try {
              const db = getFirestore();
              const expenseRef = doc(db, "otherExpense", expenseId);
              await deleteDoc(expenseRef);

              Alert.alert("Амжилттай!", "Зардал амжилттай устгагдлаа.");
              // Өгөгдлийг дахин татах функц дуудаж байна
              fetchOtherExpenses();
            } catch (error) {
              console.error("Зардлыг устгахад алдаа гарлаа:", error);
              Alert.alert("Алдаа", "Зардлыг устгахад алдаа гарлаа.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleAddBalance = async (amount) => {
    try {
      const db = getFirestore();
      const tripRef = doc(db, "trips", tripId);
      await updateDoc(tripRef, {
        startingBalance: trip.startingBalance + amount,
      });
      Alert.alert("Амжилттай!", "Мөнгөн дүн нэмэгдлээ.");
      fetchTripDetails(); // Refresh trip details
    } catch (error) {
      Alert.alert("Алдаа", "Мөнгөн дүн нэмэхэд алдаа гарлаа.");
      console.error(error);
    }
  };

  const handleCompleteTrip = async () => {
    try {
      const db = getFirestore();
      const tripRef = doc(db, "trips", tripId);
      await updateDoc(tripRef, { status: "inactive" });
      Alert.alert("Амжилттай!", "Аялал амжилттай дууслаа.");
      fetchTripDetails(); // Trip-ийн мэдээллийг дахин татах
    } catch (error) {
      Alert.alert("Алдаа", "Аяллыг дуусгахад алдаа гарлаа.");
    }
  };

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
      <View style={styles.detailSection}>
        <View style={styles.dateAndRateContainer}>
          <Text style={styles.exchangeRateLabel}>
            Ханш:{" "}
            <Text style={styles.exchangeRateText}>{trip.exchangeRate}</Text>
          </Text>
          <Text style={styles.date}>
            {new Date(trip.tripDate).toLocaleString()}
          </Text>
        </View>
        <Text style={styles.balanceLabel}>
          Анхны дүн:{" "}
          <Text style={styles.balanceText}>{trip.startingBalance}</Text>
        </Text>
        <Text style={styles.balanceLabel}>
          Үлдэгдэл дүн:{" "}
          <Text style={styles.leftBalanceText}>
            {calculateRemainingBalance()}
          </Text>
        </Text>
        <TouchableOpacity onPress={() => setAddBalanceModalVisible(true)}>
          <Text style={styles.addBalance}>Мөнгөн дүн нэмэх</Text>
        </TouchableOpacity>
        <AddBalanceModal
          visible={addBalanceModalVisible}
          onClose={() => setAddBalanceModalVisible(false)}
          onAddBalance={handleAddBalance}
        />
      </View>

      <View style={styles.expenseSection}>
        <Text style={styles.sectionTitle}>Зардлын дэлгэрэнгүй</Text>
        <Text style={styles.expenseText}>
          Гутлын зардал: {totalShoeExpenses}
        </Text>
        <Text style={styles.expenseText}>
          Бусад зардал: {totalOtherExpenses}
        </Text>
      </View>

      <View style={styles.expenseSection}>
        <Text style={styles.sectionTitle}>Гутлын зардлын жагсаалт:</Text>

        {shoeExpenses.map((expense, index) => (
          <View key={index} style={styles.shoeExpenseCard}>
            <Text style={styles.expenseDetail}>
              Код: {expense.supplierCode} | Тоо: {expense.purchasedShoesCount}
            </Text>
            <Text style={styles.expenseDetail}>
              Үнэ: {expense.shoeExpense} | Нийт үнэ: {expense.totalCost}
            </Text>
            <Text style={styles.expenseDetailPaid}>
              Төлөлт: {expense.paidAmount} |{" "}
              <Text style={styles.expenseDetailBalance}>
                Тооцоо: {expense.balanceAmount}
              </Text>
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

            <TouchableOpacity
              onPress={() =>
                handleDeleteSingleExpense(expense.id, "shoeExpense")
              }
            >
              <Text style={styles.deleteButtonText}>Устгах</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.expenseSection}>
        <Text style={styles.sectionTitle}>Бусад зардлын жагсаалт:</Text>
        {expenses.map((expense, index) => (
          <View key={index} style={styles.otherExpenseCard}>
            <Text style={styles.expenseDetail}>
              {expense.note}: {expense.amount}
            </Text>

            <TouchableOpacity
              onPress={() =>
                handleDeleteOtherExpense(expense.id, "otherExpense")
              }
            >
              <Text style={styles.deleteButtonText}>Устгах</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {trip?.status === "active" ? (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteTrip}
        >
          <Text style={styles.completeButtonText}>Аяллыг дуусгах</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleDeleteTrip}
        >
          <Text style={styles.completeButtonText}>Аяллыг устгах</Text>
        </TouchableOpacity>
      )}
      <Modal
        visible={isConfirmModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Аяллыг устгахын тулд 1234 кодыг оруулна уу
            </Text>
            <TextInput
              style={styles.input}
              placeholder="1234 код оруулна уу"
              keyboardType="numeric"
              value={confirmationCode}
              onChangeText={setConfirmationCode}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  if (confirmationCode === "1234") {
                    handleDeleteConfirmed();
                  } else {
                    Alert.alert("Алдаа", "Буруу код оруулсан байна.");
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Баталгаажуулах</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                  Цуцлах
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Add Expense Modal */}
      <AddExpenseModal
        visible={addExpenseModalVisible}
        onClose={() => setAddExpenseModalVisible(false)}
        onSelectExpenseType={handleExpenseSelection}
      />

      {/* Full-Screen Image Modal */}
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
  detailSection: {
    marginBottom: height * 0.02,
    padding: width * 0.04,
    backgroundColor: "#ffffff",
    borderRadius: width * 0.03,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateAndRateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.015,
  },
  exchangeRateLabel: {
    fontSize: width * 0.03,
    color: "#555",
  },
  exchangeRateText: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: "#00796b",
  },
  date: {
    fontSize: width * 0.03,
    color: "#555",
  },

  balanceLabel: {
    fontSize: width * 0.04,
    marginBottom: height * 0.005,
    fontWeight: "bold",
    color: "#333",
  },
  balanceText: {
    fontSize: width * 0.045,
    color: "#00C853",
    fontWeight: "bold",
  },
  leftBalanceText: {
    fontSize: width * 0.045,
    color: "#FF6347",
    fontWeight: "bold",
  },
  addBalance: {
    alignSelf: "flex-end",
    fontStyle: "italic",
    color: "#405D72",
  },
  sectionTitle: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#243642",
    marginVertical: height * 0.02,
    alignSelf: "flex-end",
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
    borderLeftWidth: 4,
    borderLeftColor: "#03A9F4",
  },
  otherExpenseCard: {
    backgroundColor: "#ffffff",
    padding: width * 0.03,
    borderRadius: width * 0.03,
    marginBottom: height * 0.02,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6347",
  },
  expenseDetail: {
    fontSize: width * 0.04,
    marginBottom: height * 0.005,
  },
  expenseDetailPaid: {
    fontSize: width * 0.04,
    marginBottom: height * 0.005,
    color: "#117554",
  },
  expenseDetailBalance: {
    fontSize: width * 0.04,
    marginBottom: height * 0.005,
    color: "#B8001F",
  },
  payment: {
    color: "#3C552D",
    fontWeight: "bold",
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
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
  completeButton: {
    marginTop: height * 0.12,
    padding: width * 0.03,
    backgroundColor: "#FF3B30",
    borderRadius: width * 0.02,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#FFF",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: width * 0.05,
    borderRadius: width * 0.025,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginBottom: height * 0.02,
  },
  modalButton: {
    backgroundColor: "#03A9F4",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.02,
    width: "100%",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF6961",
  },
  cancelButtonText: {
    color: "#FFF",
  },
  loadingText: {
    textAlign: "center",
    marginTop: height * 0.05,
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: width * 0.035,
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    padding: 10,
    width: "100%",
    marginBottom: 20,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#03A9F4",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#FF6347",
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#FFF",
  },
});

export default TripDetailScreen;
