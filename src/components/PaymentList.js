import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

const PaymentList = ({ shoeCode }) => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const db = getFirestore();
    const paymentsQuery = query(
      collection(db, "payment"),
      where("shoeCode", "==", shoeCode),
      orderBy("paymentDate", "desc"),
      limit(6) // Хамгийн сүүлийн 6 төлөлтийг татна
    );

    const querySnapshot = await getDocs(paymentsQuery);
    const paymentList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPayments(paymentList);
  };

  return (
    <ScrollView>
      {payments.length > 0 ? (
        payments.map((payment, index) => (
          <View key={payment.id} style={styles.paymentRow}>
            <Text style={styles.column}>{index + 1}</Text>
            <Text style={styles.column}>
              {new Date(
                payment.paymentDate.seconds * 1000
              ).toLocaleDateString()}
            </Text>
            <Text style={styles.column}>{payment.paymentAmount}₮</Text>
          </View>
        ))
      ) : (
        <Text>Төлөлт байхгүй байна.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  column: {
    flex: 1,
    textAlign: "center",
  },
});

export default PaymentList;
