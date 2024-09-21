import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { getFirestore, addDoc, collection } from "firebase/firestore";

const PaymentModal = ({ visible, onClose, lease }) => {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  const handleAddPayment = async () => {
    if (!paymentAmount || !paymentDate) {
      Alert.alert("Алдаа", "Бүх талбарыг бөглөнө үү.");
      return;
    }

    try {
      const db = getFirestore();
      await addDoc(collection(db, "payment"), {
        leaseID: lease.id,
        paymentDate: new Date(paymentDate),
        paymentAmount: parseFloat(paymentAmount),
      });

      Alert.alert("Амжилттай", "Төлөлт амжилттай нэмэгдлээ.");
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error adding payment: ", error);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Төлөлт оруулах</Text>

          <TextInput
            placeholder="Төлбөрийн дүн"
            value={paymentAmount}
            onChangeText={setPaymentAmount}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Төлбөрийн огноо (Жишээ: 2024-09-25)"
            value={paymentDate}
            onChangeText={setPaymentDate}
            style={styles.input}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Цуцлах</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddPayment}
            >
              <Text style={styles.buttonText}>Төлөлт нэмэх</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FF6969",
    padding: 15,
    borderRadius: 5,
    marginRight: 10,
    alignItems: "center",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default PaymentModal;
