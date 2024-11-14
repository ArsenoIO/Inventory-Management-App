// components/Modal/AddExpenseModal.js

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const AddExpenseModal = ({ visible, onClose, onSelectExpenseType }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Зардлын төрөл сонгох</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              onSelectExpenseType("otherExpense");
              onClose();
            }}
          >
            <Text style={styles.modalButtonText}>Бусад зардал</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              onSelectExpenseType("shoeExpense");
              onClose();
            }}
          >
            <Text style={styles.modalButtonText}>Гутлын зардал</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
              Буцах
            </Text>
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
    backgroundColor: "#FFF",
    padding: width * 0.05,
    borderRadius: width * 0.025,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginBottom: height * 0.02,
  },
  modalButton: {
    backgroundColor: "#03A9F4",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.02,
    width: "100%",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF6961",
  },
  cancelButtonText: {
    color: "#FFF",
  },
});

export default AddExpenseModal;
