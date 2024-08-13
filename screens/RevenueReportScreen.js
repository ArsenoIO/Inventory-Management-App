import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker";

const RevenueReportScreen = () => {
  const [shoes, setShoes] = useState([]);
  const [shoeCode, setShoeCode] = useState("");
  const [shoePrice, setShoePrice] = useState("");
  const [shoeSize, setShoeSize] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleAddShoe = () => {
    if (
      !shoeCode ||
      !shoePrice ||
      !shoeSize ||
      !discountedPrice ||
      !paymentMethod
    ) {
      Alert.alert("Алдаа", "Бүх талбарыг бөглөнө үү!");
      return;
    }

    const newShoe = {
      id: Math.random().toString(),
      code: shoeCode,
      price: shoePrice,
      size: shoeSize,
      discountedPrice: discountedPrice,
      paymentMethod: paymentMethod,
      dateAdded: new Date().toLocaleDateString(),
    };

    setShoes((prevShoes) => [...prevShoes, newShoe]);
    setShoeCode("");
    setShoePrice("");
    setShoeSize("");
    setDiscountedPrice("");
    setPaymentMethod("");
    Alert.alert("Мэдээлэл", "Гутлыг амжилттай нэмлээ!");
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.row}>
        <Text style={styles.label}>Код:</Text>
        <Text style={styles.value}>{item.code}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Үнэ:</Text>
        <Text style={styles.value}>{item.price}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Размер:</Text>
        <Text style={styles.value}>{item.size}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Хямдарсан үнэ:</Text>
        <Text style={styles.value}>{item.discountedPrice}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Төлбөрийн хэрэгсэл:</Text>
        <Text style={styles.value}>{item.paymentMethod}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Нэмсэн огноо:</Text>
        <Text style={styles.value}>{item.dateAdded}</Text>
      </View>
    </View>
  );

  const handleSearchShoe = () => {
    if (shoeCode === "123456") {
      setShoePrice("1600000");
      setShoeSize("37");
    } else {
      Alert.alert("Алдаа", "Гутал олдсонгүй");
      setShoeCode("");
      setShoePrice("");
      setShoeSize("");
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleUpload = () => {
    alert("Амжилттай илгээгдлээ");
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // Handle date selection
    hideDatePicker();
  };

  const clearList = () => {
    setShoes([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="ГУТЛЫН КОД"
            value={shoeCode}
            onChangeText={setShoeCode}
          />
          <TouchableOpacity
            onPress={handleSearchShoe}
            style={styles.searchButton}
          >
            <MaterialCommunityIcons
              name="cloud-search-outline"
              size={24}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Үнэ"
            value={shoePrice}
            onChangeText={setShoePrice}
            keyboardType="numeric"
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Размер"
            value={shoeSize}
            onChangeText={setShoeSize}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Хямдарсан үнэ"
            value={discountedPrice}
            onChangeText={setDiscountedPrice}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={paymentMethod}
            style={styles.picker}
            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          >
            <Picker.Item label="Төлбөр төлөх хэлбэр" value="" />
            <Picker.Item label="Шууд төлөлт" value="Шууд төлөлт" />
            <Picker.Item label="StorePay" value="StorePay" />
            <Picker.Item label="Pocket" value="Pocket" />
            <Picker.Item label="LendPay" value="LendPay" />
            <Picker.Item label="Хувь лизинг" value="Хувь лизинг" />
          </Picker>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button color="#0066CC" title="Нэмэх" onPress={handleAddShoe} />
        <Button color="green" title="Илгээх" onPress={handleUpload} />
        <Button color="#CC3300" title="Цэвэрлэх" onPress={clearList} />
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={shoes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.headerText}>
                Орлого - {date.toLocaleDateString()}
              </Text>
            </View>
          }
        />
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={date}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: "#0066CC",
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
    marginRight: 8,
  },
  pickerContainer: {
    borderColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  picker: {
    height: 40,
    width: "100%",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
});

export default RevenueReportScreen;
