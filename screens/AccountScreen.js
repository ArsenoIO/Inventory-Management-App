// screens/AccountScreen.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>User ID:</Text>
      <TextInput style={styles.input} placeholder="#001" editable={false} />
      
      <Text style={styles.label}>Full Name:</Text>
      <TextInput style={styles.input} placeholder="Full Name" />
      
      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} placeholder="name@domain.com" keyboardType="email-address" />
      
      <Text style={styles.label}>Password:</Text>
      <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
      
      <Button title="Save Changes" onPress={() => alert('Changes Saved')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});
