import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function CameraScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Camera Screen</Text>
      <Button
        title="Take Photo"
        onPress={() => navigation.navigate('AddShoe')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
