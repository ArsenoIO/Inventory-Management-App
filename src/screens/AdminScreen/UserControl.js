import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const db = getFirestore();
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Алдаа хэрэглэгчдийн жагсаалт татахад гарлаа:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "users", userId);

      await updateDoc(userRef, {
        userRole: newRole,
      });

      Alert.alert("Амжилттай", "Хэрэглэгчийн эрх амжилттай өөрчлөгдлөө.");
      fetchUsers(); // Жагсаалтыг дахин ачаалж харуулах
    } catch (error) {
      console.error("Хэрэглэгчийн эрх өөрчлөхөд алдаа гарлаа:", error);
      Alert.alert("Алдаа", "Хэрэглэгчийн эрх өөрчлөхөд алдаа гарлаа.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <Text>Ачааллаж байна...</Text>
      ) : (
        users.map((user) => (
          <View key={user.id} style={styles.userItem}>
            <Text style={styles.userName}>{user.userName}</Text>
            <Text>{user.email}</Text>
            <View style={styles.rolePicker}>
              <Text style={styles.roleLabel}>Эрх:</Text>
              <Picker
                selectedValue={user.userRole}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  handleRoleChange(user.id, itemValue)
                }
              >
                <Picker.Item label="Admin" value="admin" />
                <Picker.Item label="SalesPerson" value="salesPerson" />
              </Picker>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  userItem: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rolePicker: {
    marginTop: 10,
  },
  roleLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default UserManagementScreen;
