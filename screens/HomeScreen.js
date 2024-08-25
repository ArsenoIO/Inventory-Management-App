import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { firestore, auth } from "../firebaseConfig";
import { collection, query, where, getDocs,getDoc, doc } from "firebase/firestore";

import VictoryChart from "victory-native";
import VictoryBar from "victory-native";
import VictoryAxis from "victory-native";

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [registeredShoeCount, setRegisteredShoeCount] = useState(0);
  const [soldShoeCount, setSoldShoeCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading , setLoading] = useState(true);

  // Нэвтэрсэн хэрэглэгчийн мэдээллийг татаж авах
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("No user is logged in!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
      
    console.log(userData, userData.branch);
    };

    fetchUserData();
  }, []);

  // Бүртгэгдсэн зарагдаагүй гутлын тоо
  useEffect(() => {
    const fetchRegisteredShoeCount = async () => {
      if (userData && userData.branch) {
        const shoeRef = collection(firestore, "shoes");
        const q = query(shoeRef, where("locationAdded", "==", userData.branch), where("shoeSoldDate", "==", null));
        const querySnapshot = await getDocs(q);
        setRegisteredShoeCount(querySnapshot.size);
      }
    };
    fetchRegisteredShoeCount();
  }, [userData]);
/*
  // Зарагдсан гутлын тоог сараар
  useEffect(() => {
    const fetchSoldShoeCount = async () => {
      if (userData && userData.branch) {
        const shoeRef = collection(firestore, "shoes");
        const q = query(shoeRef, where("locationSold", "==", userData.branch));
        const querySnapshot = await getDocs(q);

        const soldShoesList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          soldShoesList.push({
            x: data.shoeSoldDate.toDate().toLocaleDateString("mn-MN", { month: "short", year: "numeric" }),
            y: data.shoeSoldPrice,
          });
        });
        setChartData(soldShoesList);
        setSoldShoeCount(querySnapshot.size);
      }
    };
    fetchSoldShoeCount();
  }, [userData]);*/


  if (loading) {
    return <Text>Ачааллаж байна...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.branchName}>
        {userData ? userData.branch : "САЛБАР"}
      </Text>
      <View style={styles.row}>
        <Text style={styles.row}>
          Бүртгэгдсэн гутлын тоо: {registeredShoeCount}
        </Text>
        <Text style={styles.row}>
          Зарагдсан гутлын тоо: {soldShoeCount}
        </Text>
      </View>
      
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  branchName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "top",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metric: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
/*
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { firestore } from "../firebaseConfig"; // Firestore-г зөв импортлох
import { collection, getDocs } from "firebase/firestore";
/*
const formatDate = (timestamp) => {
  if (timestamp && timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString(); // эсвэл өөрт тохирсон формат
  }
  return "";
};

const HomeScreen = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Firestore-аас өгөгдөл авах
        const querySnapshot = await getDocs(collection(firestore, "shoes"));
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text>Энэ хэсэгт Header Байна</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.shoeName}</Text>
            <Text>{item.dateAdded}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default HomeScreen;*/