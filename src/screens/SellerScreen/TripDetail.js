import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Image } from "react-native";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const TripDetailScreen = ({ route, navigation }) => {
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);
  const [shoeExpenses, setShoeExpenses] = useState([]);
  const [totalShoeExpenses, setTotalShoeExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripDetails = async () => {
      const db = getFirestore();
      const tripRef = doc(db, "trips", tripId);
      const tripSnap = await getDoc(tripRef);

      if (tripSnap.exists()) {
        setTrip(tripSnap.data());
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
      setLoading(false);
    };

    fetchTripDetails();
  }, [tripId, navigation]);

  if (loading) {
    return <Text>Ачааллаж байна...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.expenseSection}>
        <Text style={styles.subTitle}>Гутлын жагсаалт:</Text>
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
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: "#FFF",
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
});

export default TripDetailScreen;
