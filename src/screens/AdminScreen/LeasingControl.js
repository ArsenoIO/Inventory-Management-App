import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { DataTable } from "react-native-paper";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import PaymentModal from "../../components/Modal/PaymentModal"; // Assuming you have a PaymentModal component

const { width, height } = Dimensions.get("window");

const AdminLeasingScreen = () => {
  const [leasingData, setLeasingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedLease, setSelectedLease] = useState(null); // Selected lease for payment

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

  const handleDeleteLease = async (leaseId) => {
    Alert.alert(
      "Устгах уу?",
      "Энэ лизингийн мэдээллийг устгахдаа итгэлтэй байна уу?",
      [
        { text: "Цуцлах", style: "cancel" },
        {
          text: "Устгах",
          onPress: async () => {
            try {
              const db = getFirestore();
              await deleteDoc(doc(db, "leasing", leaseId));
              setLeasingData(
                leasingData.filter((lease) => lease.id !== leaseId)
              );
              Alert.alert("Амжилттай устлаа", "Лизингийн мэдээлэл устгагдлаа.");
            } catch (error) {
              console.error("Error deleting lease: ", error);
            }
          },
        },
      ]
    );
  };

  const openPaymentModal = (lease) => {
    setSelectedLease(lease);
    setPaymentModalVisible(true);
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
              <DataTable.Title style={styles.column}>Actions</DataTable.Title>
            </DataTable.Header>

            {leasingData.map((lease, index) => (
              <DataTable.Row key={lease.id}>
                <DataTable.Cell style={styles.columnFirst}>
                  {index + 1}
                </DataTable.Cell>
                <DataTable.Cell style={styles.column}>
                  {lease.shoeCode}
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
                <DataTable.Cell style={styles.column}>
                  <TouchableOpacity onPress={() => openPaymentModal(lease)}>
                    <Text style={styles.actionText}>Төлөлт</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteLease(lease.id)}>
                    <Text style={styles.deleteText}>Устгах</Text>
                  </TouchableOpacity>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>
      )}
      {selectedLease && (
        <PaymentModal
          visible={paymentModalVisible}
          onClose={() => setPaymentModalVisible(false)}
          lease={selectedLease}
        />
      )}
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
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: height * 0.05,
  },
  actionText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  deleteText: {
    color: "red",
    textDecorationLine: "underline",
    marginTop: 5,
  },
});

export default AdminLeasingScreen;
