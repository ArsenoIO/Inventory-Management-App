import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Dimensions } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width, height } = Dimensions.get("window");

const PaymentModal = ({ visible, onClose, onSubmit }) => {
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Төлөлт оруулах функц
  const handlePaymentSubmit = () => {
    if (paymentAmount && paymentDate) {
      onSubmit(paymentDate, paymentAmount);
      onClose();
    } else {
      alert("Бүх талбаруудыг бөглөнө үү!");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Төлөлт оруулах</Text>

          {/* Он сар өдөр сонгох хэсэг */}
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>Он сар өдөр: {paymentDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={paymentDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setPaymentDate(date);
              }}
            />
          )}

          {/* Мөнгөн дүн оруулах талбар */}
          <TextInput
            style={styles.input}
            placeholder="Мөнгөн дүн"
            keyboardType="numeric"
            value={paymentAmount}
            onChangeText={setPaymentAmount}
          />

          {/* Төлөлт оруулах товч */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handlePaymentSubmit}
          >
            <Text style={styles.buttonText}>Төлөлт оруулах</Text>
          </TouchableOpacity>

          {/* Хаах товч */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Хаах</Text>
          </TouchableOpacity>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#FF5757",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFF",
  },
});

export default PaymentModal;
