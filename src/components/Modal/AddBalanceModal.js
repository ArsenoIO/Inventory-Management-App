import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const AddBalanceModal = ({ visible, onClose, onAddBalance }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSave = () => {
    if (!inputValue || isNaN(inputValue)) {
      alert("Зөв мөнгөн дүн оруулна уу.");
      return;
    }
    onAddBalance(parseFloat(inputValue));
    setInputValue("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Мөнгөн дүн нэмэх</Text>
          <TextInput
            style={styles.input}
            placeholder="Мөнгөн дүн оруулна уу"
            keyboardType="numeric"
            value={inputValue}
            onChangeText={setInputValue}
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
              <Text style={styles.modalButtonText}>Хадгалах</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                Цуцлах
              </Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: width * 0.05,
    borderRadius: width * 0.025,
    width: "80%",
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    fontSize: width * 0.04,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#03A9F4",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: width * 0.04,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  cancelButtonText: {
    color: "#FFF",
  },
});

export default AddBalanceModal;
