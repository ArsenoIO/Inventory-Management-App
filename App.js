/*import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Edited on web then edited on vscode</Text>
      <Text>New line inserted</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/

import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { firestore, storage } from './firebaseConfig';

export default function App() {
  const [shoe, setShoe] = useState({
    price: '',
    name: '',
    code: '',
    dateRegistered: '',
    dateSold: '',
    imageUrl: '',
    soldPrice: '',
  });

  const handleInputChange = (name, value) => {
    setShoe({ ...shoe, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await firestore().collection('shoes').add(shoe);
      console.log('Shoe added!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (uri) => {
    const reference = storage().ref(`/shoes/${new Date().getTime()}.jpg`);
    await reference.putFile(uri);
    const imageUrl = await reference.getDownloadURL();
    handleInputChange('imageUrl', imageUrl);
  };

  return (

    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Зургийн линк"
        value={shoe.imageUrl}
        onChangeText={(text) => handleInputChange('imageUrl', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Гутлын үнэ"
        value={shoe.price}
        onChangeText={(text) => handleInputChange('price', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Нэр"
        value={shoe.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Гутлын код"
        value={shoe.code}
        onChangeText={(text) => handleInputChange('code', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Бүртгэгдсэн огноо"
        value={shoe.dateRegistered}
        onChangeText={(text) => handleInputChange('dateRegistered', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Зарагдсан огноо"
        value={shoe.dateSold}
        onChangeText={(text) => handleInputChange('dateSold', text)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Зарагдсан үнэ"
        value={shoe.soldPrice}
        onChangeText={(text) => handleInputChange('soldPrice', text)}
      />
      <Button title="Нэмэх" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});
