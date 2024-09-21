import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  Timestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import SalesReportItem from "../../../components/SalesReportItem";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import useUserData from "../../../hooks/useUserData";

const { width, height } = Dimensions.get("window");

const SalesReportScreen = () => {
  const { userData, loading: userLoading, error } = useUserData();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchReports(); // Fetch reports once the screen is loaded
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    const db = getFirestore();
    const salesReportCollection = collection(db, "salesReport");

    // Query to get reports sorted by date and unreviewed reports first
    const salesReportQuery = query(
      salesReportCollection,
      orderBy("isReviewed"), // Show unreviewed reports first
      orderBy("date", "desc") // Sort by date in descending order
    );

    try {
      const salesReportSnapshot = await getDocs(salesReportQuery);

      const salesReportList = salesReportSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate().toLocaleDateString(),
      }));

      setReports(salesReportList);
    } catch (error) {
      console.error("Error fetching reports: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return <Text>Loading user data...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const handleDetailPress = (salesReport) => {
    navigation.navigate("SalesDetailScreen", { salesReport });
  };

  const handleAddReport = async () => {
    const db = getFirestore();

    // New sales report object
    const newReport = {
      branch: userData.branch || "Unknown Branch", // Branch name from user data
      date: Timestamp.fromDate(selectedDate),
      income: 0,
      totalSales: 0,
      expenses: 0,
      totalIncome: 0,
      createdBy: userData.userName, // User who created the report
      isReviewed: false,
      comment: "No comment",
    };

    try {
      await addDoc(collection(db, "salesReport"), newReport);

      Alert.alert("Success", "New sales report created.", [
        { text: "OK", onPress: fetchReports }, // Refresh the reports
      ]);

      setModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error adding report:", error);
      Alert.alert("Error", "Failed to add sales report.");
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false); // Close the date picker
    if (date) {
      setSelectedDate(date); // Set the selected date
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          reports.map((report) => (
            <SalesReportItem
              key={report.id}
              branch={report.branch}
              date={report.date}
              income={report.totalIncome}
              totalSales={report.totalSales}
              expenses={report.expenses}
              createdBy={report.createdBy}
              isReviewed={report.isReviewed}
              onDetailPress={() => handleDetailPress(report)}
            />
          ))
        )}
      </ScrollView>

      {/* Add Report Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="plus" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Add Report Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Sales Report</Text>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                Select Date: {selectedDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddReport}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    padding: width * 0.04,
  },
  addButton: {
    position: "absolute",
    right: width * 0.05,
    bottom: height * 0.03,
    backgroundColor: "#03A9F4",
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
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
  },
  modalTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.02,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FF6969",
    padding: height * 0.02,
    borderRadius: width * 0.025,
    marginRight: width * 0.025,
    alignItems: "center",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: height * 0.02,
    borderRadius: width * 0.025,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: width * 0.04,
  },
  dateButton: {
    backgroundColor: "#E0E0E0",
    padding: height * 0.02,
    borderRadius: width * 0.025,
    marginBottom: height * 0.02,
  },
  dateText: {
    fontSize: width * 0.04,
    color: "#333",
    textAlign: "center",
  },
});

export default SalesReportScreen;
