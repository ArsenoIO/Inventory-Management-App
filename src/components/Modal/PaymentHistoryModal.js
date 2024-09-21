import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const PaymentHistoryModal = ({ leaseID, onClose }) => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true); // Уншиж байгаа төлөв

  useEffect(() => {
    if (leaseID) {
      fetchPaymentHistory();
    }
  }, [leaseID]);

  // Төлөлтийн түүхийг Firebase-аас татах функц
  const fetchPaymentHistory = async () => {
    setLoading(true);
    const db = getFirestore();
    const paymentsCollection = collection(db, "payment");

    try {
      // leasingID-г ашиглан шүүлт хийж байна
      const paymentQuery = query(
        paymentsCollection,
        where("leaseID", "==", leaseID)
      );
      const paymentSnapshot = await getDocs(paymentQuery);
      const paymentList = paymentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPaymentHistory(paymentList);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.header}>Payment History</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView style={styles.scrollContainer}>
            {paymentHistory.length > 0 ? (
              paymentHistory.map((payment, index) => (
                <View key={payment.id} style={styles.paymentRow}>
                  <Text style={styles.paymentText}>
                    {index + 1}.{" "}
                    {new Date(
                      payment.paymentDate.seconds * 1000
                    ).toLocaleDateString()}{" "}
                    - {payment.paymentAmount}₮
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noPaymentsText}>No payments found.</Text>
            )}
          </ScrollView>
        )}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  scrollContainer: {
    maxHeight: 150,
  },
  paymentRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  paymentText: {
    fontSize: 16,
    color: "#333",
  },
  noPaymentsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PaymentHistoryModal;
