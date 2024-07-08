import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Touchable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { onValue } from "firebase/database";

export default function AddShoeScreen() {
  const [shoe, setShoe] = useState({
    date: new Date().toLocaleDateString(), // default date is today
    code: "A-05134",
    name: "TMA",
    price: "1450000",
    size: "34", // default size
    color: "5",
    imageUrl: "",
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleInputChange = (name, value) => {
    setShoe({ ...shoe, [name]: value });
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleInputChange("imageUrl", result.uri);
    }
  };

  const handleSubmit = async () => {
    // Add your Firebase code here
    console.log("Shoe added:", shoe);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    handleInputChange("date", date.toLocaleDateString());
    hideDatePicker();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={handleImageUpload}>
          <View style={styles.imageContainer}>
            {shoe.imageUrl ? (
              <Image source={{ uri: shoe.imageUrl }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Огноо:</Text>
          <TouchableOpacity onPress={showDatePicker} style={styles.dateInput}>
            <Text>{shoe.date}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            date={new Date()}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Гутлын код:</Text>
          <TextInput
            style={styles.input}
            placeholder="A-12123"
            value={shoe.code}
            onChangeText={(text) => handleInputChange("code", text)}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Нэр:</Text>
          <Picker
            selectedValue={shoe.name}
            style={styles.input}
            onValueChange={(itemValue, itemIndex) =>
              handleInputChange("name", itemValue)
            }
          >
            <Picker.Item label="TMA" value="TMA" />
            <Picker.Item label="ABR" value="ABR" />
            <Picker.Item label="BRA" value="BRA" />
            <Picker.Item label="CMB" value="CMD" />
            <Picker.Item label="MDN" value="MDN" />
            <Picker.Item label="RCH" value="RCH" />
            <Picker.Item label="DGA" value="DGA" />
            <Picker.Item label="BDJ" value="BDJ" />
          </Picker>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Үнэ:</Text>
          <TextInput
            style={styles.input}
            placeholder="₮"
            value={shoe.price}
            onChangeText={(text) => handleInputChange("price", text)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Size:</Text>
          <Picker
            selectedValue={shoe.size}
            style={styles.input}
            onValueChange={(itemValue, itemIndex) =>
              handleInputChange("size", itemValue)
            }
          >
            {[...Array(11).keys()].map((i) => {
              const size = (34 + i).toString();
              return <Picker.Item key={size} label={size} value={size} />;
            })}
          </Picker>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Өнгө:</Text>
          <Picker
            selectedValue={shoe.color}
            style={styles.input}
            onValueChange={(itemValue, itemIndex) =>
              handleInputChange("color", itemValue)
            }
          >
            {[...Array(5).keys()].map((i) => {
              const size = (1 + i).toString();
              return <Picker.Item key={size} label={size} value={size} />;
            })}
          </Picker>
        </View>
        <Button
          style={styles.button}
          title="Гутал нэмэх"
          onPress={() => {
            handleSubmit();
            alert(
              `Огноо: ${shoe.date}\nГутлын код: ${shoe.code}${shoe.name}\nPrice: ${shoe.price}₮\nSize: ${shoe.size}\nColor: ${shoe.color}`
            );
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  scrollContainer: {
    padding: 20,
  },
  buttonCus: {
    width: 400,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: "#ccc",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderBottomWidth: 0.5,
    paddingLeft: 8,
    backgroundColor: "#F5F7F8",
  },
  label: {
    fontSize: 17,
    color: "black",
    fontWeight: "bold",
    marginRight: 8,
    width: 100, // you can adjust this width as needed
  },
  dateInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderBottomWidth: 0.5,
    justifyContent: "center",
    paddingLeft: 8,
    backgroundColor: "#F5F7F8",
  },
});
