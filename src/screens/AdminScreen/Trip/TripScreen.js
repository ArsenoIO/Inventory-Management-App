import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker"; // Огноо сонгоход ашиглана
import { MaterialIcons } from "@expo/vector-icons"; // Importing refresh icon

const TripScreen = () => {
  const [trips, setTrips] = useState([]);
  const [startDate, setStartDate] = useState(new Date()); // Эхлэх огноо
  const [endDate, setEndDate] = useState(new Date()); // Дуусах огноо
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const navigation = useNavigation();
  const adjustedStartDate = new Date(startDate);

  // Firestore-с аяллын өгөгдлийг татах функц
  const fetchTrips = async () => {
    const db = getFirestore();
    const tripsCollection = collection(db, "trips");

    adjustedStartDate.setDate(adjustedStartDate.getDate() - 1);
    const startTimestamp = adjustedStartDate.getTime();
    const endTimestamp = endDate.getTime();

    const tripQuery = query(
      tripsCollection,
      where("tripDate", ">=", startTimestamp),
      where("tripDate", "<=", endTimestamp)
    );

    const tripSnapshot = await getDocs(tripQuery);
    const tripList = tripSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTrips(tripList);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [startDate, endDate])
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={fetchTrips}>
          <MaterialIcons
            name="refresh"
            size={24}
            color="black"
            style={{ marginRight: 16 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [startDate, endDate]); // Огноо солигдоход fetch хийгдэнэ

  // Огнооны сонголтын функц
  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(false);
    setStartDate(currentDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(false);
    setEndDate(currentDate);
  };

  return (
    <View style={styles.container}>
      {/* Шинэ аялал үүсгэх товч */}
      <TouchableOpacity
        style={styles.createTripButton}
        onPress={() => navigation.navigate("AddTripScreen")}
      >
        <Text style={styles.buttonText}>Шинэ аялал үүсгэх</Text>
      </TouchableOpacity>

      {/* Огнооны сонголт */}
      <View style={styles.datePickers}>
        <TouchableOpacity onPress={() => setShowStartPicker(true)}>
          <Text>Эхлэх огноо: {adjustedStartDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}

        <TouchableOpacity onPress={() => setShowEndPicker(true)}>
          <Text>Дуусах огноо: {endDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onEndDateChange}
          />
        )}
      </View>

      {/* Аяллын жагсаалт */}
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tripItem}>
            <Text>{item.tripName}</Text>
            <Text>Огноо: {new Date(item.tripDate).toLocaleDateString()}</Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() =>
                navigation.navigate("TripDetailScreen", { tripId: item.id })
              }
            >
              <Text style={styles.buttonText}>Дэлгэрэнгүй</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  createTripButton: {
    backgroundColor: "#03A9F4",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  datePickers: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tripItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  detailsButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
});

export default TripScreen;
