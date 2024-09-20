import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { updateDoc, getFirestore, doc } from "firebase/firestore";
import OtherExpenseModal from "../../components/Modal/OtherExpenseModal";

const TripDetailScreen = ({ route }) => {
  const { trip } = route.params; // trip массив байж магадгүй тул доорх байдлаар авна
  const tripData = trip[0]; // Массивын эхний объект болох tripData-г авна
  console.log(tripData.initialAmount);
  console.log(tripData);
  console.log(tripData.expensesAmount);
  console.log(tripData.id);
  console.log(tripData.otherExpensesAmount);
  console.log(tripData.startDate);
  console.log(tripData.totalShoes);
  const [modalVisible, setModalVisible] = useState(false);
  const [otherExpenses, setOtherExpenses] = useState(
    tripData.otherExpenses || []
  );
  const navigation = useNavigation();

  // `startDate`-г Timestamp эсвэл Date эсэхийг шалгах
  const formattedStartDate = tripData.startDate
    ? tripData.startDate.toDate
      ? tripData.startDate.toDate().toLocaleDateString()
      : new Date(tripData.startDate).toLocaleDateString()
    : "Огноо байхгүй байна";

  // Зарцуулалтын функц
  const handleAddOtherExpense = (detail, amount, description) => {
    const newExpense = { detail, amount: parseFloat(amount), description };
    setOtherExpenses([...otherExpenses, newExpense]);
  };

  // Аяллыг дуусгах функц
  const handleFinishTrip = async () => {
    const firestore = getFirestore();
    const tripDocRef = doc(firestore, "trips", tripData.id);

    try {
      await updateDoc(tripDocRef, {
        status: false, // Аяллын төлөвийг идэвхгүй болгоно
      });
      Alert.alert("Амжилттай", "Аяллыг амжилттай дуусгалаа");
      navigation.goBack(); // Аялал руу буцах
    } catch (error) {
      console.error("Алдаа: ", error);
      Alert.alert("Алдаа", "Аяллыг дуусгах үед алдаа гарлаа");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Аяллын огноо */}
      <Text style={styles.title}>Аялал: {formattedStartDate}</Text>

      {/* Анхны мөнгөн дүн, үлдэгдэл, зарцуулсан дүн */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Анхны мөнгөн дүн: {tripData.initialAmount}
        </Text>
        <Text style={styles.infoText}>Үлдэгдэл: {tripData.balanceAmount}</Text>
        <Text style={styles.infoText}>
          Зарцуулсан дүн: {tripData.expensesAmount}
        </Text>
      </View>

      {/* Гутал худалдан авах болон бусад зардал товчууд */}
      <View style={styles.buttonContainer}>
        <Button
          title="Гутал худалдан авах"
          onPress={() =>
            navigation.navigate("ShoePurchaseScreen", { tripId: tripData.id })
          } // trip.id-г дамжуулж байна
          color="#6a1b9a"
        />

        <Button
          title="Бусад зардал"
          onPress={() => setModalVisible(true)}
          color="#2196f3"
        />
      </View>

      {/* Гутал худалдан авсан зардлуудын жагсаалт */}
      <View style={styles.expenseSection}>
        <Text style={styles.sectionTitle}>Гутал худалдан авалт</Text>
        {tripData.shoeExpenses && tripData.shoeExpenses.length > 0 ? (
          tripData.shoeExpenses.map((expense, index) => (
            <View key={index} style={styles.expenseItem}>
              <Text>Нийлүүлэгч: {expense.supplier}</Text>
              <Text>Гутлын тоо: {expense.shoesCount}</Text>
              <Text>Үнэ: {expense.price}</Text>
            </View>
          ))
        ) : (
          <Text>Гутал худалдан авсан зардал алга байна</Text>
        )}
      </View>

      {/* Бусад зардлуудын жагсаалт */}
      <View style={styles.expenseSection}>
        <Text style={styles.sectionTitle}>Бусад зардал</Text>
        {otherExpenses.map((expense, index) => (
          <View key={index} style={styles.expenseItem}>
            <Text>Утга: {expense.detail}</Text>
            <Text>Мөнгөн дүн: {expense.amount}</Text>
          </View>
        ))}
      </View>

      {/* Бусад зардал оруулах Modal */}
      <OtherExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddOtherExpense}
      />

      {/* Аялал дуусгах товч */}
      <Button
        title="Аялал дуусгах"
        onPress={handleFinishTrip}
        color="#d32f2f"
        style={styles.finishButton}
      />
    </ScrollView>
  );
};

export default TripDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FCF5ED",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  expenseSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  expenseItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  finishButton: {
    marginTop: 20,
  },
});
