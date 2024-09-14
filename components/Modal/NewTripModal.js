import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createNewTrip } from "../../services/firestoreService"; // Шинэ аяллын функц импорт

const NewTripModal = ({ visible, onClose, onSave }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [initialAmount, setInitialAmount] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    try {
      const newTripId = await createNewTrip(startDate, initialAmount); // userId-г дамжуулах шаардлагагүй
      console.log("Аялал үүсгэгдсэн ID: ", newTripId);
      onSave(startDate, initialAmount); // Өгөгдлүүдийг дамжуулна
      onClose(); // Хадгалсаны дараа цонх хаагдана
    } catch (error) {
      console.error("Аялал үүсгэхэд алдаа гарлаа: ", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(Platform.OS === "ios");
    setStartDate(currentDate); // Огноог хадгална
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Шинээр аялал үүсгэх</Text>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Эхлэх огноо:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View style={styles.inputRow}>
            <Text style={styles.label}>Мөнгөн дүн:</Text>
            <TextInput
              style={styles.input}
              placeholder="Мөнгөн дүн оруулах"
              value={initialAmount}
              onChangeText={setInitialAmount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Болих" onPress={onClose} color="#CE5A67" />
            <Button title="Үүсгэх" onPress={handleSave} color="#28a745" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NewTripModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 350,
    padding: 30,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 18,
    flex: 1,
    color: "#333",
  },
  input: {
    flex: 2,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
  },
  dateButton: {
    flex: 2,
    backgroundColor: "#F5F7F8",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    color: "#333",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
});
