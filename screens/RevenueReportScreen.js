import React, { useState, useEffect } from "react";
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  FlatList,
  Text,
  Alert,
} from "react-native";
import { firestore, auth } from "../firebaseConfig";
import {
  collection,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  Timestamp,
  getDoc,
} from "firebase/firestore";

const RevenueReportScreen = () => {
  const [shoeCode, setShoeCode] = useState("");
  const [shoeSoldPrice, setShoeSoldPrice] = useState("");
  const [isTransaction, setIsTransaction] = useState(false);
  const [isTransactionLeasing, setIsTransactionLeasing] = useState(false);
  const [isTransactionLendpay, setIsTransactionLendpay] = useState(false);
  const [isTransactionPocket, setIsTransactionPocket] = useState(false);
  const [isTransactionStorepay, setIsTransactionStorepay] = useState(false);
  const [locationSold, setLocationSold] = useState("");
  const [soldUserID, setSoldUserID] = useState("");
  const [soldShoes, setSoldShoes] = useState([]);
  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          setSoldUserID(user.uid);
          setLocationSold(userData.branch); // Assuming 'branch' is the field name in Firestore
        } else {
          Alert.alert("Хэрэглэгчийн мэдээлэл олдсонгүй.");
        }
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
      Alert.alert(
        "Хэрэглэгчийн мэдээллийг татахад алдаа гарлаа: ",
        error.message
      );
    }
  };

  const handleCheck = async () => {
    try {
      const shoeRef = collection(firestore, "shoes");
      const e = query(shoeRef, where("shoeCode", "==", shoeCode));
      const querySnapshot = await getDocs(e);
      if (querySnapshot.empty) {
        Alert.alert("Гутлын код олдсонгүй.");
        return;
      } else {
        Alert.alert("Амжилттай");
      }
    } catch (e) {
      Alert.alert("АЛДАА ГАРЛАА");
    }
  };

  const handleUpdateShoe = async () => {
    if (!shoeCode || !shoeSoldPrice) {
      Alert.alert("Бүх мэдээллээ оруулна уу.");
      return;
    }

    try {
      const shoeRef = collection(firestore, "shoes");
      const q = query(shoeRef, where("shoeCode", "==", shoeCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Гутлын код олдсонгүй.");
        return;
      }

      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          shoeSoldPrice,
          isTransaction,
          isTransactionLeasing,
          isTransactionLendpay,
          isTransactionPocket,
          isTransactionStorepay,
          locationSold,
          shoeSoldDate: Timestamp.fromDate(new Date()),
          soldUserID,
        });
      });

      Alert.alert("Гутлын мэдээллийг амжилттай шинэчиллээ.");
      setShoeCode("");
      setShoeSoldPrice("");
      setIsTransaction(false);
      setIsTransactionLeasing(false);
      setIsTransactionLendpay(false);
      setIsTransactionPocket(false);
      setIsTransactionStorepay(false);
      setLocationSold("");
      setSoldUserID("");
      fetchSoldShoes(); // Refresh the sold shoes list
    } catch (error) {
      Alert.alert("Мэдээллийг шинэчлэхэд алдаа гарлаа: ", error.message);
    }
  };

  const fetchSoldShoes = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const shoeRef = collection(firestore, "shoes");
      const q = query(
        shoeRef,
        where("shoeSoldDate", ">=", Timestamp.fromDate(today)),
        where("shoeSoldDate", "<", Timestamp.fromDate(tomorrow))
      );
      const querySnapshot = await getDocs(q);
      const soldShoesList = [];
      let totalAmount = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        soldShoesList.push(data);
        totalAmount += parseFloat(data.shoeSoldPrice);
      });

      setSoldShoes(soldShoesList);
      setTotalSalesCount(soldShoesList.length);
      setTotalAmount(totalAmount);
    } catch (error) {
      Alert.alert("Мэдээллийг татахад алдаа гарлаа: ", error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchSoldShoes();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Гутлын код"
        value={shoeCode}
        onChangeText={setShoeCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Зарагдсан үнэ"
        value={shoeSoldPrice}
        onChangeText={setShoeSoldPrice}
        keyboardType="numeric"
      />
      <Button title="Гутлын мэдээллийг шинэчлэх" onPress={handleUpdateShoe} />

      <Button style={styles.button} title="Шалгах" onPress={handleCheck} />

      <View style={styles.summary}>
        <Text>Өнөөдрийн нийт зарсан гутлын тоо: {totalSalesCount}</Text>
        <Text>Өнөөдрийн нийт үнийн дүн: {totalAmount}</Text>
      </View>

      <FlatList
        data={soldShoes}
        keyExtractor={(item) => item.shoeCode}
        renderItem={({ item }) => (
          <View style={styles.shoeItem}>
            <Text>Гутлын код: {item.shoeCode}</Text>
            <Text>Гутлын нэр: {item.shoeName}</Text>
            <Text>Зарагдсан үнэ: {item.shoeSoldPrice}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  summary: {
    marginVertical: 16,
  },
  shoeItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  button: {
    color: "red",
  },
});

export default RevenueReportScreen;
