import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const BumbugurBranchScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 10 секунд уншиж байгаа төлөв харуулах
    const timeout = setTimeout(() => {
      // 10 секундийн дараа алдаа гарлаа гэж үзнэ
      setLoading(false);
      setError(true);
    }, 10000);

    // Цэвэрлэх функц
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#185519" />
        <Text style={styles.loadingText}>Уншиж байна...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Өгөгдөл татахад алдаа гарлаа!</Text>
      </View>
    );
  }

  // Түр унтраасан үндсэн контентыг доор нь үлдээнэ
  return (
    <View style={styles.container}>
      <Text>Энэ хэсэг одоогоор идэвхгүй байна.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFBFF",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#185519",
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginTop: 10,
  },
});

export default BumbugurBranchScreen;
