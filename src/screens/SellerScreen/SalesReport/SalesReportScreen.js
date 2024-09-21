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
} from "firebase/firestore"; // addDoc ашиглана
import SalesReportItem from "../../../components/SalesReportItem";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons"; // Нэмэх товчинд зориулсан icon
import DateTimePicker from "@react-native-community/datetimepicker"; // DateTime picker ашиглана
import useUserData from "../../../hooks/useUserData";

const { width, height } = Dimensions.get("window");

const SalesReportScreen = () => {
  const { userData, loading: userLoading, error } = useUserData();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Модалын харагдах төлөв
  const [selectedDate, setSelectedDate] = useState(new Date()); // Он сар өдөр сонгох талбар
  const [showDatePicker, setShowDatePicker] = useState(false); // Өдөр сонгох товчийг харагдуулах төлөв
  const navigation = useNavigation();

  useEffect(() => {
    if (userData && userData.branch) {
      fetchReports(userData.branch); // Fetch reports once user data is available
    }
  }, [userData]);

  const fetchReports = async (userBranch) => {
    setLoading(true);
    const db = getFirestore();

    try {
      // Query the salesReport collection for reports from the user's registered branch
      const salesReportCollection = collection(db, "salesReport");
      const salesReportQuery = query(
        salesReportCollection,
        where("branch", "==", userBranch)
      ); // Filter by branch
      const salesReportSnapshot = await getDocs(salesReportQuery);

      const salesReportList = salesReportSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate().toLocaleDateString(),
      }));

      setReports(salesReportList);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return <Text>Loading user data...</Text>; // Display loading while user data is being fetched
  }

  if (error) {
    return <Text>Error: {error}</Text>; // Handle any errors from the useUserData hook
  }

  const handleDetailPress = (salesReport) => {
    navigation.navigate("SalesDetailScreen", { salesReport });
  };

  const handleAddReport = async () => {
    const db = getFirestore();

    // Шинэ тайлан үүсгэх утгууд (автоматаар үүснэ)
    const newReport = {
      branch: userData.branch, // Салбарын нэрийг автоматаар тохируулж болно
      date: Timestamp.fromDate(selectedDate), // Сонгосон огноо

      income: 0, // Эхний орлого 0
      totalSales: 0, // Зарагдсан гутлын тоо 0
      expenses: 0, // Зардал 0

      totalIncome: 0, // Нийт орлого (income - expenses)
      createdBy: userData.userName, // Хэн үүсгэснийг заана
      isReviewed: false, // Тайланг хараахан хянаагүй
      comment: "Байхгүй", // Тайлбар
    };

    try {
      // Firebase дээр тайлан нэмэх
      await addDoc(collection(db, "salesReport"), newReport);

      // Тайлан нэмсэнтэй холбоотой амжилтын Alert
      Alert.alert("Амжилттай", "Шинэ орлогын тайлан үүслээ.", [
        { text: "OK", onPress: fetchReports }, // Тайланг дахин татаж харуулна
      ]);

      setModalVisible(false); // Модалыг хаана
    } catch (error) {
      console.error("Тайлан нэмэхэд алдаа гарлаа:", error);
      Alert.alert("Алдаа", "Тайлан нэмэхэд алдаа гарлаа.");
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false); // Өдөр сонгосны дараа picker-ийг хаах
    if (date) {
      setSelectedDate(date); // Сонгосон огноог state-д хадгалах
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <Text>Ачааллаж байна...</Text>
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
              onDetailPress={() => handleDetailPress(report)} // Дэлгэрэнгүй рүү шилжих
            />
          ))
        )}
      </ScrollView>

      {/* Absolute байрлалтай нэмэх товч */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="plus" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Тайлан үүсгэхэд зориулсан модал */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Шинэ тайлан үүсгэх</Text>

            {/* Өдөр сонгох товч */}
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                Огноо сонгох: {selectedDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {/* Өдөр сонгох DateTimePicker */}
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
                <Text style={styles.buttonText}>Цуцлах</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddReport}
              >
                <Text style={styles.buttonText}>Нэмэх</Text>
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
    padding: width * 0.04, // Padding relative to screen width
  },
  addButton: {
    position: "absolute",
    right: width * 0.05, // 5% from the right
    bottom: height * 0.03, // 3% from the bottom
    backgroundColor: "#03A9F4",
    width: width * 0.15, // Button width relative to screen size
    height: width * 0.15, // Keeping the button circular, height = width
    borderRadius: (width * 0.15) / 2, // Circular button
    justifyContent: "center",
    alignItems: "center",
    elevation: 8, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent background
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: width * 0.05, // Modal padding relative to screen size
    borderRadius: width * 0.025, // Border radius relative to screen size
    width: "80%",
  },
  modalTitle: {
    fontSize: width * 0.045, // Font size relative to screen size
    fontWeight: "bold",
    marginBottom: height * 0.02, // Margin relative to screen height
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.02, // Margin relative to screen height
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FF6969",
    padding: height * 0.02, // Padding relative to screen height
    borderRadius: width * 0.025, // Border radius relative to screen size
    marginRight: width * 0.025, // Margin relative to screen size
    alignItems: "center",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: height * 0.02, // Padding relative to screen height
    borderRadius: width * 0.025, // Border radius relative to screen size
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: width * 0.04, // Font size relative to screen size
  },
  dateButton: {
    backgroundColor: "#E0E0E0",
    padding: height * 0.02, // Padding relative to screen height
    borderRadius: width * 0.025, // Border radius relative to screen size
    marginBottom: height * 0.02, // Margin relative to screen height
  },
  dateText: {
    fontSize: width * 0.04, // Font size relative to screen size
    color: "#333",
    textAlign: "center",
  },
});

export default SalesReportScreen;
