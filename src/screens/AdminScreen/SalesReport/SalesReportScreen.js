import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import SalesReportItem from "../../../components/SalesReportItem";
import DateTimePicker from "@react-native-community/datetimepicker"; // Огноо сонгох
import useUserData from "../../../hooks/useUserData";

const { width, height } = Dimensions.get("window");

const SalesReportScreen = () => {
  const { userData, loading: userLoading, error } = useUserData();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0); // Нийт орлого
  const [totalSales, setTotalSales] = useState(0); // Нийт зарагдсан гутал
  const [startDate, setStartDate] = useState(new Date()); // Эхлэх огноо
  const [endDate, setEndDate] = useState(new Date()); // Дуусах огноо
  const [showStartPicker, setShowStartPicker] = useState(false); // Эхлэх огноо сонгох
  const [showEndPicker, setShowEndPicker] = useState(false); // Дуусах огноо сонгох
  const navigation = useNavigation();

  const adjustedStartDate = new Date(startDate);
  adjustedStartDate.setDate(adjustedStartDate.getDate() - 1); // Subtract 1 day from the start date

  const fetchReports = async () => {
    setLoading(true);
    const db = getFirestore();
    const salesReportCollection = collection(db, "salesReport");

    const salesReportQuery = query(
      salesReportCollection,
      where("date", ">=", Timestamp.fromDate(adjustedStartDate)), // Use the adjusted start date
      where("date", "<=", Timestamp.fromDate(endDate))
    );

    const salesReportSnapshot = await getDocs(salesReportQuery);

    const salesReportList = salesReportSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate().toLocaleDateString(),
    }));

    // Нийт орлого болон зарагдсан гутлын тоог нэгтгэнэ
    const totalIncome = salesReportList.reduce(
      (acc, report) => acc + report.totalIncome,
      0
    );
    const totalSales = salesReportList.reduce(
      (acc, report) => acc + report.totalSales,
      0
    );

    setReports(salesReportList);
    setTotalIncome(totalIncome);
    setTotalSales(totalSales);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]); // Огноо сонгоход дахин тайлан татах

  const handleDetailPress = (salesReport) => {
    navigation.navigate("SalesDetailScreen", { salesReport });
  };

  return (
    <View style={styles.container}>
      {/* Огноо сонгох хэсэг */}
      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          style={styles.dateButton}
        >
          <Text>{adjustedStartDate.toDateString()}</Text>
        </TouchableOpacity>
        <Text> - </Text>
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          style={styles.dateButton}
        >
          <Text>{endDate.toDateString()}</Text>
        </TouchableOpacity>
      </View>

      {/* Эхлэх огноо сонгох DatePicker */}
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

      {/* Дуусах огноо сонгох DatePicker */}
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

      {/* Нийт орлого болон зарагдсан гутлын тоо */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Орлого: {totalIncome}₮</Text>
        <Text style={styles.totalText}>Зарагдсан гутал: {totalSales}</Text>
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: height * 0.02,
    borderRadius: width * 0.025,
    alignItems: "center",
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
  buttonText: {
    color: "#fff",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  dateText: {
    alignSelf: "center",
    fontSize: 18,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContainer: {
    padding: 16,
  },
  reportItem: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  branchText: {
    fontSize: 16,
    fontWeight: "bold",
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
  },
});

export default SalesReportScreen;
