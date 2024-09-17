import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import TripButton from "../../components/TripButton";
import NewTripModal from "../../components/Modal/NewTripModal";
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Firestore функцууд
import useUserData from "../../hooks/useUserData"; // Хэрэглэгчийн өгөгдлийг авах custom hook

const TripScreen = () => {
  const [tripId, setTripId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [trips, setTrips] = useState([]); // Firestore-оос татах аяллын өгөгдлийг хадгалах
  const navigation = useNavigation();
  const { userData, loading, error } = useUserData(); // Custom hook ашиглаж байна

  // Firestore-оос аяллуудыг татах функц
  const fetchTrips = async () => {
    const firestore = getFirestore();
    const tripsCollection = collection(firestore, "trips");
    const tripsSnapshot = await getDocs(tripsCollection);
    const tripsList = tripsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTrips(tripsList);
  };

  useEffect(() => {
    if (!loading && userData) {
      // Хэрэв хэрэглэгч admin бол аяллуудыг татаж байна
      if (userData.userRole === "admin") {
        fetchTrips(); // Компонент ачаалагдах үед аяллуудыг татах
      } else {
        // Хэрэв хэрэглэгч admin биш бол хандалтын эрхгүй анхааруулга гаргана
        Alert.alert(
          "Хандах эрхгүй",
          "Танд аяллын мэдээлэлд хандах эрх байхгүй байна.",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(), // Хэрэглэгчийг буцаах
            },
          ]
        );
      }
    }
  }, [userData, loading]);

  // Шинэ аялал үүсгэх функцыг дуудаж байна
  const handleCreateTrip = async (startDate, initialAmount) => {
    // Firestore-оос шинэ аялал үүсгэсний дараа дахин татах
    await fetchTrips();
    setModalVisible(false); // Модалыг хаах
  };

  // Дэлгэрэнгүй товч дарахад зөвхөн нэг trip объектыг дамжуулах
  const handlePressDetail = (trip) => {
    navigation.navigate("TripDetailScreen", { trip });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TripButton onPress={() => setModalVisible(true)} />
      </View>

      <View style={styles.tripHistory}>
        <Text style={styles.subtitle}>Аяллын түүх</Text>
        {/* Firestore-оос татсан аяллуудыг энд харуулна */}
        {trips.map((trip) => (
          <View key={trip.id} style={styles.trip}>
            <Text style={styles.tripDate}>
              Аялал: {trip.startDate.toDate().toLocaleDateString()}
            </Text>
            <Text>Нийт авсан гутал: {trip.totalShoes}</Text>
            <Text>Гутлын мөнгөн дүн: {trip.totalShoesAmount}</Text>
            <Text>Бусад зардал: {trip.otherExpensesAmount}</Text>
            <Text>Үлдэгдэл тооцоо: {trip.balanceAmount}</Text>
            <Text style={styles.activeStatus}>
              Төлөв: {trip.status ? "Идэвхтэй" : "Идэвхгүй"}
            </Text>
            <Button
              title="Дэлгэрэнгүй"
              color={"#FF6969"}
              onPress={() => handlePressDetail(trip)} // Зөвхөн тухайн trip-ийг дамжуулах
            />
          </View>
        ))}
      </View>

      <NewTripModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleCreateTrip}
      />
    </ScrollView>
  );
};

export default TripScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  tripHistory: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1717",
    marginBottom: 10,
  },
  trip: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: "#F4BF96",
    borderWidth: 1,
  },
  tripDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CE5A67",
    marginBottom: 5,
  },
  activeStatus: {
    color: "#28a745",
    fontWeight: "bold",
  },
});
