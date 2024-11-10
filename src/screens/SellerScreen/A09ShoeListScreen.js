import React, { useEffect, useState } from "react";
import { View, Button, ScrollView, Text } from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Timestamp } from "firebase/firestore";

const A09ShoeListScreen = () => {
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    const fetchA09Shoes = async () => {
      const db = getFirestore();
      const shoesRef = collection(db, "shoes");

      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const endOfToday = new Date(today.setHours(23, 59, 59, 999));

      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));

      const q = query(
        shoesRef,
        where("addedBranch", "==", "ТӨВ САЛБАР"),
        where("addedDate", ">=", Timestamp.fromDate(startOfYesterday)),
        where("addedDate", "<=", Timestamp.fromDate(endOfToday))
      );

      try {
        const querySnapshot = await getDocs(q);
        let shoesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // shoeCode утгаар эрэмбэлэх
        shoesList = shoesList.sort(
          (a, b) =>
            parseInt(a.shoeCode.replace(/\D/g, "")) -
            parseInt(b.shoeCode.replace(/\D/g, ""))
        );

        console.log("Fetched Shoes List:", shoesList);
        setShoes(shoesList);
      } catch (error) {
        console.error(
          "ТӨВ САЛБАР-ын өчигдөр болон өнөөдөр бүртгэсэн гутлуудыг авчрахад алдаа гарлаа:",
          error
        );
      }
    };

    fetchA09Shoes();
  }, []);

  const generateCodeSortedPDF = async () => {
    console.log("Shoes for Code-Sorted PDF:", shoes);
    let htmlContent = `<h1>Кодын дарааллаар ТӨВ САЛБАР-ын бүртгэсэн гутлууд</h1>`;
    let counter = 1;

    shoes.forEach((shoe) => {
      htmlContent += `<p>${counter}. ${shoe.shoeCode} - Размер: ${shoe.shoeSize} - Үнэ: ${shoe.shoePrice}₮</p>`;
      counter++;
    });

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("PDF файл үүсгэгдлээ:", uri);
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("PDF үүсгэхэд алдаа гарлаа:", error);
    }
  };

  return (
    <ScrollView>
      <View>
        <Button
          title="Кодын дарааллаар PDF үүсгэх"
          onPress={generateCodeSortedPDF}
        />

        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
          Гутлын жагсаалт (Кодын дарааллаар)
        </Text>
        {shoes.map((shoe, index) => (
          <Text key={shoe.id}>
            {index + 1}. {shoe.shoeCode} - Размер: {shoe.shoeSize} - Үнэ:{" "}
            {shoe.shoePrice}₮
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default A09ShoeListScreen;
