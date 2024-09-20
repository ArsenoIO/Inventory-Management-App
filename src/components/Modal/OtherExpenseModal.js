import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet } from "react-native";

const OtherExpenseModal = ({ visible, onClose, onSave }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [detail, setDetail] = useState("");

  const handleSave = () => {
    // Оруулах утгуудыг дамжуулж хадгална
    onSave(detail, amount, description);
    // Цонхыг хаах
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Бусад зардал нэмэх</Text>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Утга:</Text>
            <TextInput
              style={styles.input}
              value={detail}
              onChangeText={setDetail}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Мөнгөн дүн:</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Тэмдэглэл:</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Болих" onPress={onClose} color="#CE5A67" />
            <Button title="Хадгалах" onPress={handleSave} color="#28a745" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OtherExpenseModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Цонхны арын бүдэгрэл
  },
  modalContent: {
    width: 350,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    flex: 2,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
  },
  label: {
    fontSize: 18,
    flex: 1,
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
