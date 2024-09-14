import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import OtherExpenseModal from "../../components/Modal/OtherExpenseModal";
import { useNavigation } from "@react-navigation/native";

const TripDetailScreen = ({ route }) => {
  const { trip } = route.params; // TripScreen-с дамжуулсан аяллын мэдээлэл
  const [modalVisible, setModalVisible] = useState(false);
  const [otherExpenses, setOtherExpenses] = useState(trip.otherExpenses || []); // otherExpenses байхгүй бол хоосон массив
  const navigation = useNavigation(); // Navigation ашиглах

  // Бусад зардал нэмэх функц
  const handleAddOtherExpense = (description, amount) => {
    const newExpense = { description, amount: parseFloat(amount) };
    setOtherExpenses([...otherExpenses, newExpense]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Аялал: {trip.startDate}</Text>
      <Text style={styles.detailText}>
        Анхны мөнгөн дүн: {trip.initialAmount}
      </Text>
      <Text style={styles.detailText}>Үлдэгдэл: {trip.balanceAmount}</Text>
      <Text style={styles.detailText}>Зарцуулсан дүн: {trip.spentAmount}</Text>

      <View style={styles.expenseButtons}>
        <Button
          title="Гутал худалдан авах"
          onPress={() => navigation.navigate("ShoePurchaseScreen")} // Дэлгэц рүү шилжих
          color="#6a1b9a"
        />
        <Button
          title="Бусад зардал"
          onPress={() => setModalVisible(true)}
          color="#2196f3"
        />
      </View>
      {/* Зарцуулсан гутлын зардлууд */}
      <View style={styles.expenseSection}>
        <Text style={styles.sectionTitle}>Гутлын зардал</Text>
        {/* shoeExpenses байхгүй бол хоосон массив болгож ашиглах */}
        {(trip.shoeExpenses || []).map((expense, index) => (
          <View key={index} style={styles.expenseItem}>
            <Text>Нийлүүлэгч: {expense.supplier}</Text>
            <Text>Аван гутал: {expense.shoesCount}</Text>
            <Text>Үнэ: {expense.price}</Text>
            <Button title="Дэлгэрэнгүй" onPress={() => {}} />
          </View>
        ))}
      </View>

      {/* Бусад зардлууд */}
      <View style={styles.expenseSection}>
        <Text style={styles.sectionTitle}>Бусад зардал</Text>
        {otherExpenses.map((expense, index) => (
          <View key={index} style={styles.expenseItem}>
            <Text>Тайлбар: {expense.description}</Text>
            <Text>Мөнгөн дүн: {expense.amount}</Text>
          </View>
        ))}
      </View>

      <OtherExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddOtherExpense}
      />

      <Button title="Аялал дуусгах" onPress={() => {}} color="#d32f2f" />
    </View>
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
    marginBottom: 20,
    color: "#CE5A67",
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  expenseButtons: {
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
});
