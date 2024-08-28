import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { firestore, auth } from "../firebaseConfig";
import { collection, query, where, getDocs,getDoc, doc } from "firebase/firestore";
import { Card, Title, Paragraph } from "react-native-paper";

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

  if (loading) {
    return <Text>Ачааллаж байна...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.branchName}>
        {userData ? userData.branch : "САЛБАР"}
      </Text>
      <View style={styles.row}>
        <Text >
          Нийт бүртгэгдсэн гутал:
          <Text style={[styles.metric, { color: "#059212",fontSize: 15 }]}> {registeredShoeCount}</Text>
        </Text>
        
        <Text >
          Нийт зарагдсан гутал:
          <Text style={[styles.metric, { color: "#26355D", fontSize: 15 }]}> {soldShoeCount}</Text>
        </Text>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Борлуулалт</Title>
          <Paragraph style={styles.cardSubtitle}>(ТӨВ САЛБАР)</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Борлуулалт</Title>
          <Paragraph style={styles.cardSubtitle}>(ӨВӨРХАНГАЙ)</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Борлуулалт</Title>
          <Paragraph style={styles.cardSubtitle}>(АЛТЖИН БӨМБӨГӨР)</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Орлого /7 хоногоор/</Title>
          <Paragraph style={styles.cardSubtitle}>(ТӨВ САЛБАР)</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Орлого /7 хоногоор/</Title>
          <Paragraph style={styles.cardSubtitle}>(ӨВӨРХАНГАЙ)</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Орлого /7 хоногоор/</Title>
          <Paragraph style={styles.cardSubtitle}>(АЛТЖИН БӨМБӨГӨР)</Paragraph>
        </Card.Content>
      </Card>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    marginTop: "10%",
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
    fontSize: 13,
    fontWeight: "bold",
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#F5F7F8",  // Customize card background color if needed
    height: 350,
  },
  cardTitle: {
    fontSize: 18,
    color: "#45474B", // Custom color for card title
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 11,
    color: "#919191", // Custom color for card subtitle
  },
});

export default HomeScreen;
