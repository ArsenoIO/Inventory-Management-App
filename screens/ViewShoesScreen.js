import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
// Import your Firebase configuration here

export default function ViewShoesScreen() {
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    // Fetch shoes from Firebase
    // Example:
    // firebase.firestore().collection('shoes').onSnapshot((snapshot) => {
    //   const fetchedShoes = snapshot.docs.map(doc => ({
    //     id: doc.id,
    //     ...doc.data()
    //   }));
    //   setShoes(fetchedShoes);
    // });

    // Temporary mock data
    setShoes([
      { id: '1', name: 'Shoe 1', price: '1000₮', colorSize: 'Red/42' },
      { id: '2', name: 'Shoe 2', price: '1500₮', colorSize: 'Blue/43' }
    ]);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <Text>{item.price}</Text>
      <Text>{item.colorSize}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={shoes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
