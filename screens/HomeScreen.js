import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { firestore, auth } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import Borluulalt from "../components/Borluulalt";

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [registeredShoeCount, setRegisteredShoeCount] = useState(0);
  const [soldShoeCount, setSoldShoeCount] = useState(0);
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [loading, setLoading] = useState(true);

  const fetchSalesData = async () => {
    try {
      const salesRef = collection(firestore, "sales");
      const querySnapshot = await getDocs(salesRef);

      const filteredData = querySnapshot.docs
        .filter((doc) => {
          const { soldShoesList } = doc.data();
          return soldShoesList.some(
            (shoe) => shoe.addedBranch === "ТӨВ САЛБАР"
          );
        })
        .map((doc) => {
          const { totalSales } = doc.data();
          const date = doc.id.substring(9); // Баримтын ID-аас он сар өдөр авах
          const formattedDate = `${date.substring(4, 6)}/${date.substring(
            6,
            8
          )}`; // Сар/Өдөр
          return { date: formattedDate, sales: totalSales };
        });

      const labels = filteredData.map((item) => item.date);
      const data = filteredData.map((item) => item.sales);

      setSalesData({
        labels: labels,
        datasets: [{ data: data }],
      });
    } catch (error) {
      console.error("Error fetching sales data: ", error);
    }
  };

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
    };
    fetchSalesData();
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchRegisteredShoeCount = async () => {
      if (userData && userData.branch) {
        const shoeRef = collection(firestore, "shoes");
        const q = query(
          shoeRef,
          where("addedBranch", "==", userData.branch),
          where("isSold", "==", false)
        );
        const w = query(
          shoeRef,
          where("addedBranch", "==", userData.branch),
          where("isSold", "==", true)
        );
        const querySnapshot = await getDocs(q);
        const wSnapshot = await getDocs(w);
        setRegisteredShoeCount(querySnapshot.size);
        setSoldShoeCount(wSnapshot.size);
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
        <Text>
          Нийт бүртгэгдсэн гутал:
          <Text style={[styles.metric, { color: "#059212", fontSize: 15 }]}>
            {" "}
            {registeredShoeCount}
          </Text>
        </Text>

        <Text>
          Нийт зарагдсан гутал:
          <Text style={[styles.metric, { color: "#26355D", fontSize: 15 }]}>
            {" "}
            {soldShoeCount}
          </Text>
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        <Borluulalt title="ТӨВ САЛБАР" data={salesData} />
        <Borluulalt title="ӨВӨРХАНГАЙ" data={salesData} />
        <Borluulalt title="БӨМБӨГӨР" data={salesData} />
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        <Borluulalt title="ТӨВ САЛБАР" data={salesData} />
        <Borluulalt title="ӨВӨРХАНГАЙ" data={salesData} />
        <Borluulalt title="БӨМБӨГӨР" data={salesData} />
      </ScrollView>
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
  horizontalScroll: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 10,
  },
});

export default HomeScreen;
