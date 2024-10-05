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
import { AntDesign, MaterialIcons } from "@expo/vector-icons"; // Icons

const TripDetailScreen = ({ route, navigation }) => {
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);
  const [shoeExpenses, setShoeExpenses] = useState([]); // For shoe expenses
  const [expenses, setExpenses] = useState([]);
  const [totalShoeExpenses, setTotalShoeExpenses] = useState(0); // Total of shoe expenses
  const [totalOtherExpenses, setTotalOtherExpenses] = useState(0); // Total of other expenses
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility

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
        fetchShoeExpenses(); // Fetch shoe expenses
      } else {
        Alert.alert("Алдаа", "Аяллын дэлгэрэнгүй мэдээлэл олдсонгүй.");
        navigation.goBack();
      }
    };

    // Fetch shoe expenses
    const fetchShoeExpenses = async () => {
      const db = getFirestore();
      const shoeExpenseQuery = query(
        collection(db, "shoeExpense"),
        where("tripId", "==", tripId),
        where("type", "==", "shoeExpense") // Type of shoe expenses
      );

      const shoeExpenseSnapshot = await getDocs(shoeExpenseQuery);
      const shoeExpenseList = shoeExpenseSnapshot.docs.map((doc) => doc.data());

      setShoeExpenses(shoeExpenseList);

      // Calculate total shoe expenses
      const totalShoeCost = shoeExpenseList.reduce((acc, expense) => {
        const cost = parseFloat(expense.totalCost) || 0; // Ensure totalCost is a number
        return acc + cost;
      }, 0);

      setTotalShoeExpenses(totalShoeCost);
    };

    const fetchOtherExpenses = async () => {
      const db = getFirestore();
      const expenseQuery = query(
        collection(db, "otherExpense"),
        where("tripID", "==", tripId),
        where("type", "==", "otherExpense") // Type of other expenses
      );

      const expenseSnapshot = await getDocs(expenseQuery);
      const expenseList = expenseSnapshot.docs.map((doc) => doc.data());

      setExpenses(expenseList);

      // Calculate total other expenses
      const totalExpenses = expenseList.reduce(
        (acc, expense) => acc + expense.amount,
        0
      );
      setTotalOtherExpenses(totalExpenses);
      setLoading(false);
    };

    fetchTripDetails();
  }, [tripId, navigation]);

  // Calculate the remaining balance
  const calculateRemainingBalance = () => {
    if (!trip) return 0;
    return (
      trip.startingBalance - (totalShoeExpenses + totalOtherExpenses) // Subtract both shoe and other expenses
    );
  };

  // Handle modal selection for expenses
  const handleExpenseSelection = (type) => {
    setModalVisible(false); // Close modal
    if (type === "otherExpense") {
      navigation.navigate("AddOtherExpenseScreen", { tripId });
    } else if (type === "shoeExpense") {
      navigation.navigate("AddShoeExpenseScreen", { tripId });
    }
  };

  //Аяллыг устгах функц
  const handleDeleteTrip = async () => {
    try {
      const db = getFirestore();
      const tripRef = doc(db, "trips", tripId);
      await deleteDoc(tripRef); // Delete the trip

      Alert.alert("Амжилттай!", "Аялал амжилттай устгагдлаа.");
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      Alert.alert("Алдаа", "Аяллыг устгахад алдаа гарлаа.");
      console.log(error);
    }
  };

  // Handle completing the trip
  const handleCompleteTrip = async () => {
    try {
      const db = getFirestore();
      const tripRef = doc(db, "trips", tripId);
      await updateDoc(tripRef, {
        tripEndDate: new Date().getTime(), // Add trip end date
      });

      Alert.alert("Амжилттай!", "Аялал амжилттай дууслаа.");
      navigation.goBack(); // Go back to the previous screen
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

        <Text style={styles.label}>
          Огноо: {new Date(trip.tripDate).toLocaleString()}
        </Text>
        <Text style={styles.label}>Эхлэх дүн: {trip.startingBalance}₮</Text>
        <Text style={styles.label}>Гутлын зардал: {totalShoeExpenses}₮</Text>
        <Text style={styles.label}>Бусад зардал: {totalOtherExpenses}₮</Text>
        <Text style={styles.label}>
          Үлдэгдэл дүн: {calculateRemainingBalance()}₮
        </Text>
      </View>

      {/* List shoe expenses */}
      <View style={styles.expenseSection}>
        <Text style={styles.label}>Гутлын зардлын жагсаалт:</Text>
        {shoeExpenses.map((expense, index) => (
          <View key={index} style={styles.shoeExpenseItem}>
            <Text style={styles.expenseText}>
              Нийлүүлэгч: {expense.supplierCode} | Тоо:{" "}
              {expense.purchasedShoesCount} | Үнэ: {expense.shoeExpense}₮ | Нийт
              үнэ: {expense.totalCost}
            </Text>
            {expense.image && (
              <Image source={{ uri: expense.image }} style={styles.image} />
            )}
          </View>
        ))}
      </View>

      {/* List other expenses */}
      <View style={styles.expenseSection}>
        <Text style={styles.label}>Бусад зардлын жагсаалт:</Text>
        {expenses.map((expense, index) => (
          <Text key={index} style={styles.expenseText}>
            {expense.note}: {expense.amount}₮
          </Text>
        ))}
      </View>

      {/* Add new expense button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)} // Open modal
      >
        <AntDesign name="plus" size={30} color="#FFF" />
      </TouchableOpacity>
      {/* Complete Trip Button */}
      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleCompleteTrip}
      >
        <Text style={styles.completeButtonText}>Аяллыг дуусгах</Text>
      </TouchableOpacity>

      {/* Modal for selecting expense type */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Зардлын төрөл сонгох</Text>
            <Button
              title="Бусад зардал"
              onPress={() => handleExpenseSelection("otherExpense")}
            />
            <Button
              title="Гутлын зардал"
              onPress={() => handleExpenseSelection("shoeExpense")}
            />
            <Button title="Буцах" onPress={() => setModalVisible(false)} />
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
    backgroundColor: "#F1F1F1",
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  expenseSection: {
    marginTop: 20,
  },
  expenseText: {
    fontSize: 16,
    marginVertical: 5,
  },
  shoeExpenseItem: {
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 5,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#03A9F4",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
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
});

export default TripDetailScreen;
