import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  Dimensions,
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleDeleteTrip}>
          <MaterialIcons
            name="delete"
            size={24}
            color="red"
            style={{ marginRight: 16 }}
          />
        </TouchableOpacity>
      ),
    });

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

    const fetchShoeExpenses = async () => {
      const db = getFirestore();
      const shoeExpenseQuery = query(
        collection(db, "shoeExpense"),
        where("tripId", "==", tripId),
        where("type", "==", "shoeExpense")
      );

      const shoeExpenseSnapshot = await getDocs(shoeExpenseQuery);
      const shoeExpenseList = shoeExpenseSnapshot.docs.map((doc) => doc.data());

      setShoeExpenses(shoeExpenseList);
      const totalShoeCost = shoeExpenseList.reduce(
        (acc, expense) => acc + parseFloat(expense.totalCost || 0),
        0
      );
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
      const expenseList = expenseSnapshot.docs.map((doc) => doc.data());

      setExpenses(expenseList);
      const totalExpenses = expenseList.reduce(
        (acc, expense) => acc + expense.amount,
        0
      );
      setTotalOtherExpenses(totalExpenses);
      setLoading(false);
    };

    fetchTripDetails();
  }, [tripId, navigation]);

  const calculateRemainingBalance = () => {
    if (!trip) return 0;
    return trip.startingBalance - (totalShoeExpenses + totalOtherExpenses);
  };

  const handleExpenseSelection = (type) => {
    setModalVisible(false);
    if (type === "otherExpense") {
      navigation.navigate("AddOtherExpenseScreen", { tripId });
    } else if (type === "shoeExpense") {
      navigation.navigate("AddShoeExpenseScreen", { tripId });
    }
  };

  const handleDeleteTrip = async () => {
    Alert.alert(
      "Баталгаажуулалт",
      "Энэ аяллыг болон холбогдох бүх зардлыг устгахдаа итгэлтэй байна уу?",
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
              const tripRef = doc(db, "trips", tripId);
              await deleteDoc(tripRef);

              // Холбогдох зардлуудыг устгах функц дуудах
              await handleDeleteExpensesByTripId(tripId);

              Alert.alert(
                "Амжилттай!",
                "Аялал болон холбогдох зардлууд устгагдлаа."
              );
              navigation.goBack();
            } catch (error) {
              Alert.alert("Алдаа", "Аяллыг устгахад алдаа гарлаа.");
              console.log(error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleCompleteTrip = async () => {
    try {
      const db = getFirestore();
      const tripRef = doc(db, "trips", tripId);
      await updateDoc(tripRef, { tripEndDate: new Date().getTime() });
      Alert.alert("Амжилттай!", "Аялал амжилттай дууслаа.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Алдаа", "Аяллыг дуусгахад алдаа гарлаа.");
    }
  };

  const handleDeleteSingleExpense = async (expenseId, collectionName) => {
    try {
      const db = getFirestore();
      const expenseRef = doc(db, collectionName, expenseId);
      await deleteDoc(expenseRef);
      Alert.alert("Амжилттай!", "Зардал амжилттай устгагдлаа.");
    } catch (error) {
      console.error("Устгалтын алдаа гарлаа:", error);
      Alert.alert("Алдаа", "Зардлыг устгахад алдаа гарлаа.");
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Ачааллаж байна...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="plus" size={30} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.detailSection}>
        <Text style={styles.date}>
          {new Date(trip.tripDate).toLocaleString()}
        </Text>
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

            <Text style={styles.expenseDetail}>
              Төлөгдсөн эсэх: {expense.paymentMade}
            </Text>

            <TouchableOpacity
              onPress={() =>
                handleDeleteSingleExpense(expense.id, "shoeExpense")
              }
            >
              <Text>Устгах</Text>
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
              onPress={() => handleDeleteExpensesByTripId(expense.tripID)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Устгах</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleCompleteTrip}
      >
        <Text style={styles.completeButtonText}>Аяллыг дуусгах</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Зардлын төрөл сонгох</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleExpenseSelection("otherExpense")}
            >
              <Text style={styles.modalButtonText}>Бусад зардал</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleExpenseSelection("shoeExpense")}
            >
              <Text style={styles.modalButtonText}>Гутлын зардал</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                Буцах
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    backgroundColor: "#FFF",
  },
  detailSection: {
    marginBottom: height * 0.02,
    padding: width * 0.04,
    backgroundColor: "#F9FAFB",
    borderRadius: width * 0.02,
    elevation: 2,
  },
  date: {
    fontSize: width * 0.03,
    alignSelf: "flex-end",
    marginBottom: height * 0.015,
  },
  balanceLabel: {
    fontSize: width * 0.04,
    marginBottom: height * 0.005,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  balanceText: {
    fontSize: width * 0.045,
    color: "#00C853",
    marginBottom: height * 0.005,
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
  leftBalanceText: {
    fontSize: width * 0.045,
    color: "#FF6347",
    marginBottom: height * 0.005,
    fontWeight: "bold",
    alignSelf: "flex-start",
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
    backgroundColor: "#FFF",
    padding: width * 0.04,
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    elevation: 1,
  },
  otherExpenseCard: {
    backgroundColor: "#FFF",
    padding: width * 0.03,
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    elevation: 1,
  },
  expenseDetail: {
    fontSize: width * 0.04,
    marginBottom: height * 0.005,
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
  addButton: {
    position: "absolute",
    right: width * 0.1,
    bottom: height * 0.1,
    backgroundColor: "#03A9F4",
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  completeButton: {
    marginTop: height * 0.12,
    padding: width * 0.03,
    backgroundColor: "#4CAF50",
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
  deleteButton: {
    backgroundColor: "#FF6347",
    padding: width * 0.02,
    borderRadius: width * 0.02,
    marginTop: height * 0.01,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: width * 0.035,
    fontWeight: "bold",
  },
});

export default TripDetailScreen;
