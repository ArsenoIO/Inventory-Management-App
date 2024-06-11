import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { firebase, firestore, storage } from './firebaseConfig';

export default function AddShoeScreen({ navigation }) {
  const [shoe, setShoe] = useState({
    date: new Date().toLocaleDateString(),
    code: '',
    name: '',
    price: '',
    color: '',
    imageUrl: '',
  });

  const handleInputChange = (name, value) => {
    setShoe({ ...shoe, [name]: value });
  };

  const handleImageUpload = async (uri) => {
    const reference = storage().ref(`/shoes/${new Date().getTime()}.jpg`);
    await reference.putFile(uri);
    const imageUrl = await reference.getDownloadURL();
    handleInputChange('imageUrl', imageUrl);
  };

  const handleTakePhoto = () => {
    launchCamera({ mediaType: 'photo', maxWidth: 800, maxHeight: 600, quality: 0.8 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        handleImageUpload(uri);
      }
    });
  };

  const handleSubmit = async () => {
    try {
      await firestore().collection('shoes').add(shoe);
      console.log('Shoe added!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take Photo" onPress={handleTakePhoto} />
      {shoe.imageUrl ? (
        <Image source={{ uri: shoe.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>Image Preview</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={shoe.date}
        onChangeText={(text) => handleInputChange('date', text)}
        editable={false}
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
        placeholder="Color"
        value={shoe.color}
        onChangeText={(text) => handleInputChange('color', text)}
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
  image: {
    width: '100%',
    height: 200,
    marginVertical: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});
