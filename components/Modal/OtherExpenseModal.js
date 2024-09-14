import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet } from "react-native";

const OtherExpenseModal = ({ visible, onClose, onSave }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleSave = () => {
    // Оруулах утгуудыг дамжуулж хадгална
    onSave(description, amount);
    // Цонхыг хаах
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Бусад зардал нэмэх</Text>

          <Text>Тайлбар:</Text>
          <TextInput
            style={styles.input}
            placeholder="Зардлын тайлбар"
            value={description}
            onChangeText={setDescription}
          />

          <Text>Мөнгөн дүн:</Text>
          <TextInput
            style={styles.input}
            placeholder="Мөнгөн дүн"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

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
    width: 300,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
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
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
