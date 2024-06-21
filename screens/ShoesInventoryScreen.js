/*
1.Д/д:
2.Гутлын код:
3.Размер:
4.Төрөл:
5.Дугаар:
6.Үндсэн үнэ:
7.Хямдарсан үнэ:
8.Хямдрал:
9.Бэлэн мөнгө:
10.Мобайл:


Гутлын код:
*/

import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, FlatList } from 'react-native';
import * as FileSystem from 'expo-file-system'; // For file system operations (saving to file)
import * as Sharing from 'expo-sharing'; // For sharing the file (optional)
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function ShoesInventoryScreen() {

  const [shoes, setShoes] = useState([]);
  const [shoeName, setShoeName] = useState('');
  const [shoePrice, setShoePrice] = useState('');
  const [shoeColorSize, setShoeColorSize] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleAddShoe = () => {
    if (!shoeName || !shoePrice || !shoeColorSize) {
      Alert.alert('Алдаа', 'Гутлын нэр, үнэ, өнгө оруулна уу!');
      return;
    }

    const newShoe = {
      id: Math.random().toString(),
      name: shoeName,
      price: shoePrice,
      colorSize: shoeColorSize,
      dateAdded: new Date().toLocaleDateString(),
    };

    setShoes(prevShoes => [...prevShoes, newShoe]);
    setShoeName('');
    setShoePrice('');
    setShoeColorSize('');
    Alert.alert('Мэдээлэл', 'Гутлыг амжилттай нэмлээ!');
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.row}>
        <Text style={styles.label}>Нэр:</Text>
        <Text style={styles.value}>{item.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Үнэ:</Text>
        <Text style={styles.value}>{item.price}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Өнгө/Хэмжээ:</Text>
        <Text style={styles.value}>{item.colorSize}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Нэмсэн огноо:</Text>
        <Text style={styles.value}>{item.dateAdded}</Text>
      </View>
    </View>
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
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
        <TextInput
          style={styles.input}
          placeholder="Гутлын нэр"
          value={shoeName}
          onChangeText={setShoeName}
        />
        <TextInput
          style={styles.input}
          placeholder="Үнэ"
          value={shoePrice}
          onChangeText={setShoePrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Өнгө / Хэмжээ"
          value={shoeColorSize}
          onChangeText={setShoeColorSize}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Нэмэх" onPress={handleAddShoe} />
        <Button title="Цэвэрлэх" onPress={clearList} />
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={shoes}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.headerText}>Гутлын мэдээлэл</Text>
            </View>
          }
        />
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={new Date()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
    marginRight: 8,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
});
