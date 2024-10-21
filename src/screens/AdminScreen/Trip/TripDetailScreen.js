import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Button,
  Image,
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
} from "firebase/firestore";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

const TripDetailScreen = ({ route, navigation }) => {
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);
  const [shoeExpenses, setShoeExpenses] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalShoeExpenses, setTotalShoeExpenses] = useState(0);
  const [totalOtherExpenses, setTotalOtherExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

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

      const totalShoeCost = shoeExpenseList.reduce((acc, expense) => {
        const cost = parseFloat(expense.totalCost) || 0;
        return acc + cost;
      }, 0);

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
      await updateDoc(tripRef, {
        tripEndDate: new Date().getTime(),
      });

      Alert.alert("Амжилттай!", "Аялал амжилттай дууслаа.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Алдаа", "Аяллыг дуусгахад алдаа гарлаа.");
    }
  };

  if (loading) {
    return <Text>Ачааллаж байна...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.detailSection}>
        <Text style={styles.title}>Аяллын дэлгэрэнгүй</Text>
        <Text style={styles.balanceText}>
          {new Date(trip.tripDate).toLocaleString()}
        </Text>
        <Text style={styles.balanceText}>
          Анхны дүн: {trip.startingBalance}
        </Text>
        <Text style={styles.leftBalanceText}>
          Үлдэгдэл дүн: {calculateRemainingBalance()}₮
        </Text>
      </View>

      <View style={styles.detailSection}>
        <Text>
          Гутлын зардал:{"  "}
          <Text style={styles.expenseText}>{totalShoeExpenses}₮</Text>
        </Text>
        <Text>
          Бусад зардал:{"  "}
          <Text style={styles.expenseText}>{totalOtherExpenses}₮</Text>
        </Text>
      </View>

      <View style={styles.expenseSection}>
        <Text style={styles.subTitle}>Гутлын зардлын жагсаалт:</Text>
        {shoeExpenses.map((expense, index) => (
          <View key={index} style={styles.shoeExpenseCard}>
            <Text style={styles.expenseDetail}>
              Код: {expense.supplierCode} | Тоо: {expense.purchasedShoesCount}
            </Text>
            <Text style={styles.expenseDetail}>
              Үнэ: {expense.shoeExpense}₮ | Нийт үнэ: {expense.totalCost}₮
            </Text>
            {expense.image && (
              <Image source={{ uri: expense.image }} style={styles.image} />
            )}
            <Text style={styles.expenseDetail}>
              Төлөгдсөн эсэх: {expense.paymentMade}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.expenseSection}>
        <Text style={styles.subTitle}>Бусад зардлын жагсаалт:</Text>
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
        <View style={styles.modalContainerca}>
          <View style={styles.modalContentca}>
            <Text style={styles.modalTitleca}>Зардлын төрөл сонгох</Text>

            {/* Бусад зардал товч */}
            <TouchableOpacity
              style={styles.modalButtonca}
              onPress={() => handleExpenseSelection("otherExpense")}
            >
              <Text style={styles.modalButtonTextca}>Бусад зардал</Text>
            </TouchableOpacity>

            {/* Гутлын зардал товч */}
            <TouchableOpacity
              style={styles.modalButtonca}
              onPress={() => handleExpenseSelection("shoeExpense")}
            >
              <Text style={styles.modalButtonTextca}>Гутлын зардал</Text>
            </TouchableOpacity>

            {/* Буцах товч */}
            <TouchableOpacity
              style={[styles.modalButtonca, styles.cancelButtonca]}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={[styles.modalButtonTextca, styles.cancelButtonTextca]}
              >
                Буцах
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  expenseText: {
    fontSize: 18,
    color: "#FF6347",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  expenseSection: {
    marginTop: 20,
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
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
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
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalContainerca: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent background
  },
  modalContentca: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitleca: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButtonca: {
    backgroundColor: "#03A9F4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonTextca: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonca: {
    backgroundColor: "#FF6961", // Red background for cancel button
  },
  cancelButtonTextca: {
    color: "#FFF",
  },
});

export default TripDetailScreen;
