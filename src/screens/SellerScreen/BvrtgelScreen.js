import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { startOfDay, endOfDay } from "date-fns"; // date-fns ашиглан өдрийн эхлэл ба төгсгөлийг авах

const BvrtgelScreen = () => {
  const [shoes, setShoes] = useState([]);
  const [totalShoes, setTotalShoes] = useState(0);

  useEffect(() => {
    const fetchTodayShoes = async () => {
      const db = getFirestore();
      const startOfSeptember = new Date(2023, 8, 1); // 2023 оны 9 сарын 1 (8 нь 9-р сар учир 0-ээс эхэлдэг)
      const endOfSeptember15 = new Date(2023, 8, 15); // 2023 оны 9 сарын 15

      const todayStart = startOfDay(startOfSeptember); // 2023 оны 9 сарын 1-ний эхлэл
      const todayEnd = endOfDay(endOfSeptember15); // 2023 оны 9 сарын 15-ны төгсгөл

      const shoesRef = collection(db, "shoes");

      // Гутлуудыг өнөөдөр бүртгэгдсэнээр нь шүүж байна
      const q = query(
        shoesRef,
        where("addedDate", ">=", todayStart),
        where("addedDate", "<=", todayEnd)
      );

      try {
        const querySnapshot = await getDocs(q);
        const shoesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Шүүлтийн дараах гутлуудын тоо:", shoesList.length);

        const sortedShoes = shoesList.sort((a, b) => {
          // shoeCode доторх тоон хэсгийг ялгаж авах
          const numA = a.shoeCode.match(/\d+/)
            ? parseInt(a.shoeCode.match(/\d+/)[0])
            : 0;
          const numB = b.shoeCode.match(/\d+/)
            ? parseInt(b.shoeCode.match(/\d+/)[0])
            : 0;

          // Үсэг болон тоо хосолсон кодоор харьцуулах
          if (a.shoeCode < b.shoeCode) return -1;
          if (a.shoeCode > b.shoeCode) return 1;
          // Хэрэв үсгээр эхэлсэн хэсэг нь ижил бол тоогоор нь эрэмбэлнэ
          return numA - numB;
        });

        setShoes(sortedShoes); // Эрэмбэлсэн гутлын жагсаалтыг state-д хадгалах
        setTotalShoes(shoesList.length);
      } catch (error) {
        console.error("Өнөөдрийн гутлуудыг авчрахад алдаа гарлаа:", error);
      }
    };

    fetchTodayShoes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Өнөөдөр бүртгэгдсэн гутлууд</Text>
      <Text style={styles.totalText}>Нийт гутал: {totalShoes}</Text>
      {/*<FlatList
        data={shoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.shoeItem}>
            <Text>Гутлын код: {item.shoeCode}</Text>
            <Text>Гутлын нэр: {item.shoeName}</Text>
          </View>
        )}
      />*/}
    </View>
  );
};

export default BvrtgelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  totalshoe: {
    flex: 1,
    marginTop: "10%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  totalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  shoeItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    elevation: 2,
  },
});
