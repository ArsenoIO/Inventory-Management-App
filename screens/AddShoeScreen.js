import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AddShoeScreen() {
  const [shoe, setShoe] = useState({
    date: '',
    code: '',
    name: '',
    price: '',
    colorSize: '',
    imageUrl: '',
  });

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
      handleInputChange('imageUrl', result.uri);
    }
  };

  const handleSubmit = async () => {
    // Add your Firebase code here
    console.log('Shoe added:', shoe);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImageUpload}>
        <View style={styles.imageContainer}>
          {shoe.imageUrl ? (
            <Image source={{ uri: shoe.imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </View>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={shoe.date}
        onChangeText={(text) => handleInputChange('date', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Shoe Code"
        value={shoe.code}
        onChangeText={(text) => handleInputChange('code', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={shoe.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={shoe.price}
        onChangeText={(text) => handleInputChange('price', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Color/Size"
        value={shoe.colorSize}
        onChangeText={(text) => handleInputChange('colorSize', text)}
      />
      <Button title="Add Shoe" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#ccc',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});
