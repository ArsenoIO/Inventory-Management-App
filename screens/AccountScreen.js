import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function AccountScreen() {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Implement your logout logic here
    // For example, navigate to the logout screen or clear user session
    navigation.navigate('Login'); // Navigate to login screen after logout
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="account-circle" size={150} color="#45474B" />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Хэрэглэгчийн ID:</Text>
          <Text style={styles.value}>#001</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Нэр:</Text>
          <Text style={styles.value}>Доржоо</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Нэвтрэх нэр:</Text>
          <Text style={styles.value}>ots001</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Салбар:</Text>
          <Text style={styles.value}>ТӨВ САЛБАР</Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <MaterialCommunityIcons name="logout" size={24} color="black" />
        <Text style={styles.logoutText}>Гарах</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    color: 'gray',
  },
  value: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CE5A67',
    padding: 12,
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
});
