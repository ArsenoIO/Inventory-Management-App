import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const ShoeDetailModal = ({ visible, onClose, shoeData }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {shoeData ? (
            <>
              <Text style={styles.modalTitle}>Гутлын дэлгэрэнгүй</Text>
              <Text>Код: {shoeData.shoeCode}</Text>
              <Text>Нэр: {shoeData.shoeName}</Text>
              <Text>Үнэ: {shoeData.shoePrice}₮</Text>
              <Text>Размер: {shoeData.shoeSize}</Text>
              <Text>Зарсан: {shoeData.isSold ? "Тийм" : "Үгүй"}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Хаах</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text>Мэдээлэл татаж байна...</Text>
          )}
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
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FF5757",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFF",
  },
});

export default ShoeDetailModal;
