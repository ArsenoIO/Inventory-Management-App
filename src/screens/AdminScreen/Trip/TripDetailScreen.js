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
    try {
      const db = getFirestore();
      const tripRef = doc(db, "trips", tripId);
      await deleteDoc(tripRef);
      Alert.alert("Амжилттай!", "Аялал амжилттай устгагдлаа.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Алдаа", "Аяллыг устгахад алдаа гарлаа.");
      console.log(error);
    }
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

  if (loading) {
    return <Text style={styles.loadingText}>Ачааллаж байна...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.detailSection}>
        <Text style={styles.title}>Аяллын дэлгэрэнгүй</Text>
        <Text style={styles.balanceText}>
          {new Date(trip.tripDate).toLocaleString()}
        </Text>
        <Text style={styles.balanceText}>
          Анхны дүн: {trip.startingBalance}₮
        </Text>
        <Text style={styles.leftBalanceText}>
          Үлдэгдэл дүн: {calculateRemainingBalance()}₮
        </Text>
      </View>

      <View style={styles.expenseSection}>
        <Text style={styles.sectionTitle}>Зардлын дэлгэрэнгүй</Text>
        <Text style={styles.expenseText}>
          Гутлын зардал: {totalShoeExpenses}₮
        </Text>
        <Text style={styles.expenseText}>
          Бусад зардал: {totalOtherExpenses}₮
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
              Үнэ: {expense.shoeExpense}₮ | Нийт үнэ: {expense.totalCost}₮
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
          </View>
        ))}
      </View>

      <View style={styles.expenseSection}>
        <Text style={styles.sectionTitle}>Бусад зардлын жагсаалт:</Text>
        {expenses.map((expense, index) => (
          <View key={index} style={styles.otherExpenseCard}>
            <Text style={styles.expenseDetail}>
              {expense.note}: {expense.amount}₮
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="plus" size={30} color="#FFF" />
      </TouchableOpacity>

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
    padding: 16,
    flexGrow: 1,
    backgroundColor: "#FFF",
  },
  detailSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  balanceText: {
    fontSize: 18,
    color: "#00C853",
    marginBottom: 5,
    fontWeight: "bold",
    alignSelf: "center",
  },
  leftBalanceText: {
    fontSize: 18,
    color: "#FF6347",
    marginBottom: 5,
    fontWeight: "bold",
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  expenseText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
  shoeExpenseCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  otherExpenseCard: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  expenseDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 8,
    marginTop: 10,
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
    right: 20,
    bottom: 80,
    backgroundColor: "#03A9F4",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  completeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#FFF",
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
  modalButton: {
    backgroundColor: "#03A9F4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
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
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TripDetailScreen;
