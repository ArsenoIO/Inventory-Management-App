import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const { width } = Dimensions.get("window");

const TripScreen = () => {
  const [trips, setTrips] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const navigation = useNavigation();

  const fetchTrips = async () => {
    const db = getFirestore();
    const tripsCollection = collection(db, "trips");
    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setDate(adjustedStartDate.getDate() - 1);

    const tripQuery = query(
      tripsCollection,
      where("tripDate", ">=", adjustedStartDate.getTime()),
      where("tripDate", "<=", endDate.getTime())
    );

    const tripSnapshot = await getDocs(tripQuery);
    setTrips(tripSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [startDate, endDate])
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={fetchTrips} style={{ marginRight: 16 }}>
          <MaterialIcons name="refresh" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, startDate, endDate]);

  return (
    <View style={styles.container}>
      {/* Date Picker Section */}
      <View style={styles.datePickers}>
        <TouchableOpacity onPress={() => setShowStartPicker(true)}>
          <Text style={styles.dateText}>
            Эхлэх огноо: {startDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}
        <TouchableOpacity onPress={() => setShowEndPicker(true)}>
          <Text style={styles.dateText}>
            Дуусах огноо: {endDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}
      </View>

      {/* Trip List */}
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tripItem}
            onPress={() =>
              navigation.navigate("TripDetailScreen", { tripId: item.id })
            }
          >
            <Text style={styles.tripName}>{item.tripName}</Text>
            <Text style={styles.dateDetail}>
              Огноо: {new Date(item.tripDate).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Add New Trip Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddTripScreen")}
      >
        <MaterialIcons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  datePickers: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
  },
  tripItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  tripName: {
    fontWeight: "bold",
    color: "#333",
  },
  dateDetail: {
    fontSize: 20,
    color: "#666",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#03A9F4",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default TripScreen;
