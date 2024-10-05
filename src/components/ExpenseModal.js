import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";

const ExpenseModal = ({ visible, onClose, onSave }) => {
  const [expenseAmount, setExpenseAmount] = useState(""); // Зардлын дүн
  const [newComment, setNewComment] = useState(""); // Шинэ тайлбар

  const handleSave = () => {
    if (!expenseAmount || isNaN(expenseAmount)) {
      alert("Зөвхөн тоон утга оруулна уу!");
      return;
    }
    onSave(expenseAmount, newComment); // Утгуудыг хадгалах функц руу илгээх
    onClose(); // Modal-ыг хаах
    setExpenseAmount(""); // Утгуудыг цэвэрлэх
    setNewComment("");
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Зардал нэмэх</Text>

          {/* Зардлын дүн оруулах */}
          <TextInput
            value={expenseAmount}
            onChangeText={setExpenseAmount}
            placeholder="Зардлын дүн"
            keyboardType="numeric"
            style={styles.input}
          />

          {/* Тайлбар оруулах */}
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Тэмдэглэл"
            multiline
            style={styles.input}
          />

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Цуцлах</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Хадгалах</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    height: 40,
    textAlignVertical: "top",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default ExpenseModal;
