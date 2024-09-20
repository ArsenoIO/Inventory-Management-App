import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { DataTable } from "react-native-paper";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import ShoeDetailModal from "../../components/ShoeDetailModal";
import PaymentModal from "../../components/PaymentModal"; // PaymentModal-г импортлож байна

const { width, height } = Dimensions.get("window");

const AdminLeasingScreen = () => {
  const [leasingData, setLeasingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false); // Төлөлт оруулах модалын төлөв
  const [selectedShoeData, setSelectedShoeData] = useState(null); // Modal-д харуулах гутлын мэдээлэл

  useEffect(() => {
    fetchLeasingData();
  }, []);

  const fetchLeasingData = async () => {
    const db = getFirestore();
    const leasingCollection = collection(db, "leasing");

    try {
      const leasingSnapshot = await getDocs(leasingCollection);
      const leasingList = leasingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeasingData(leasingList);
    } catch (error) {
      console.error("Error fetching leasing data: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Гутлын мэдээллийг татах функц
  const fetchShoeDetail = async (shoeCode) => {
    const db = getFirestore();
    const shoeDocRef = doc(db, "shoes", shoeCode);
    const shoeDoc = await getDoc(shoeDocRef);

    if (shoeDoc.exists()) {
      setSelectedShoeData(shoeDoc.data());
      setModalVisible(true); // Modal-г харуулна
    } else {
      console.error("Гутлын мэдээлэл олдсонгүй");
    }
  };

  // Төлөлт оруулах функц
  const handlePaymentSubmit = async (date, amount) => {
    const db = getFirestore();
    try {
      await addDoc(collection(db, "payment"), {
        paymentDate: date,
        paymentAmount: amount,
        paymentDetail: `Төлөлт: ${selectedShoeData?.shoeCode}`, // Төлбөрийн дэлгэрэнгүй
      });
      alert("Төлөлт амжилттай нэмэгдлээ.");
    } catch (error) {
      console.error("Error adding payment: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leasing Data</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <ScrollView horizontal={true}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={styles.columnFirst}>№</DataTable.Title>
              <DataTable.Title style={styles.column}>Shoe Code</DataTable.Title>
              <DataTable.Title style={styles.column}>
                Advance Payment
              </DataTable.Title>
              <DataTable.Title style={styles.column}>Phone</DataTable.Title>
              <DataTable.Title style={styles.column}>
                Account No.
              </DataTable.Title>
              <DataTable.Title style={styles.column}>
                Account Owner
              </DataTable.Title>
              <DataTable.Title style={styles.column}>Date</DataTable.Title>
              <DataTable.Title style={styles.column}>
                Leasing Note
              </DataTable.Title>
            </DataTable.Header>

            {leasingData.map((lease, index) => (
              <DataTable.Row key={lease.id}>
                <DataTable.Cell style={styles.columnFirst}>
                  {index + 1}
                </DataTable.Cell>
                <DataTable.Cell style={styles.column}>
                  <TouchableOpacity
                    onPress={() => fetchShoeDetail(lease.shoeCode)}
                  >
                    <Text style={styles.shoeCodeText}>{lease.shoeCode}</Text>
                  </TouchableOpacity>
                </DataTable.Cell>
                <DataTable.Cell style={styles.column}>
                  {lease.advancePayment}
                </DataTable.Cell>
                <DataTable.Cell style={styles.column}>
                  {lease.buyerPhoneNumber}
                </DataTable.Cell>
                <DataTable.Cell style={styles.column}>
                  {lease.accountNumber}
                </DataTable.Cell>
                <DataTable.Cell style={styles.column}>
                  {lease.accountOwner}
                </DataTable.Cell>
                <DataTable.Cell style={styles.column}>
                  {new Date(
                    lease.leasingDate.seconds * 1000
                  ).toLocaleDateString()}
                </DataTable.Cell>
                <DataTable.Cell style={styles.column}>
                  {lease.leasingNote}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>
      )}

      {/* ShoeDetailModal component ашиглаж байна */}
      <ShoeDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        shoeData={selectedShoeData}
      />

      {/* PaymentModal component */}
      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onSubmit={handlePaymentSubmit}
      />

      {/* Төлөлт оруулах товч */}
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => setPaymentModalVisible(true)}
      >
        <Text style={styles.paymentButtonText}>Төлөлт оруулах</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  column: {
    justifyContent: "center",
    minWidth: 100,
  },
  columnFirst: {
    justifyContent: "center",
    minWidth: 30,
  },
  shoeCodeText: {
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: height * 0.05,
  },
  paymentButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#03A9F4",
    padding: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default AdminLeasingScreen;
