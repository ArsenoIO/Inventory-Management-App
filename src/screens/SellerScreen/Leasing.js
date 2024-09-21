import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { DataTable } from "react-native-paper";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import PaymentHistoryModal from "../../components/Modal/PaymentHistoryModal"; // Custom Modal for Payment History
import PaymentModal from "../../components/Modal/PaymentModal";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const AdminLeasingScreen = () => {
  const [leasingData, setLeasingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLease, setSelectedLease] = useState(null); // Store the selected lease for both modals
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false); // Payment modal state
  const [isPaymentHistoryModalVisible, setIsPaymentHistoryModalVisible] =
    useState(false); // Payment history modal state

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

  // Handle opening the payment modal
  const handlePayment = (lease) => {
    setSelectedLease(lease); // Set the selected lease
    setIsPaymentModalVisible(true); // Show payment modal
  };

  // Handle opening the payment history modal
  const handlePaymentHistory = (lease) => {
    setSelectedLease(lease); // Set the selected lease
    setIsPaymentHistoryModalVisible(true); // Show payment history modal
  };

  const handlePaymentSubmit = async (paymentAmount) => {
    const db = getFirestore();
    const leaseRef = doc(db, "leasing", selectedLease.id);
    const newTotalPayment = selectedLease.totalPayment + paymentAmount;

    await updateDoc(leaseRef, {
      totalPayment: newTotalPayment, // Update total payment
    });

    // Update local state
    setLeasingData((prevData) =>
      prevData.map((lease) =>
        lease.id === selectedLease.id
          ? { ...lease, totalPayment: newTotalPayment }
          : lease
      )
    );

    setIsPaymentModalVisible(false); // Close modal after payment
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
              <DataTable.Title style={styles.column}>
                Total Payment
              </DataTable.Title>
              <DataTable.Title style={styles.column}>
                Remaining Balance
              </DataTable.Title>
              <DataTable.Title style={styles.column}>Phone</DataTable.Title>
              <DataTable.Title style={styles.column}>Date</DataTable.Title>
              <DataTable.Title style={styles.column}>
                Leasing Note
              </DataTable.Title>
              <DataTable.Title style={styles.column}>Action</DataTable.Title>
            </DataTable.Header>

            {leasingData.map((lease, index) => {
              const remainingBalance = lease.soldPrice - lease.totalPayment; // Calculate remaining balance

              return (
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
                    <TouchableOpacity
                      onPress={() => handlePaymentHistory(lease)}
                    >
                      <Text style={styles.paymentText}>
                        {lease.totalPayment}₮
                      </Text>
                    </TouchableOpacity>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.column}>
                    {remainingBalance}₮
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.column}>
                    {lease.buyerPhoneNumber}
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
                    <Button
                      title="Төлөлт"
                      onPress={() => handlePayment(lease)}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
        </ScrollView>
      )}

      {/* Payment History Modal */}
      {selectedLease && (
        <Modal
          visible={isPaymentHistoryModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsPaymentHistoryModalVisible(false)}
        >
          <PaymentHistoryModal
            leaseID={selectedLease.id}
            onClose={() => setIsPaymentHistoryModalVisible(false)}
          />
        </Modal>
      )}

      {/* Payment Modal */}
      {selectedLease && (
        <Modal
          visible={isPaymentModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsPaymentModalVisible(false)}
        >
          <PaymentModal
            visible={isPaymentModalVisible}
            onClose={() => setIsPaymentModalVisible(false)}
            onSubmit={handlePaymentSubmit}
            lease={selectedLease}
          />
        </Modal>
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
    minWidth: 120,
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
  paymentText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default AdminLeasingScreen;
