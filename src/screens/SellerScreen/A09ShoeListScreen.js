import React, { useEffect, useState } from "react";
import { View, Button } from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import * as Print from "expo-print"; // expo-print ашиглах
import * as Sharing from "expo-sharing"; // expo-sharing ашиглах

const A09ShoeListScreen = () => {
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    const fetchA09Shoes = async () => {
      const db = getFirestore();
      const shoesRef = collection(db, "shoes");

      // A09 кодтой гутлуудыг шүүх
      const q = query(
        shoesRef,
        where("shoeCode", ">=", "A09"),
        where("shoeCode", "<", "A10")
      );

      try {
        const querySnapshot = await getDocs(q);
        const shoesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShoes(shoesList); // Гутлын жагсаалтыг state-д хадгалах
      } catch (error) {
        console.error("A09 кодтой гутлуудыг авчрахад алдаа гарлаа:", error);
      }
    };

    fetchA09Shoes();
  }, []);

  // Гутлуудыг нэрээр нь ангилах функц
  const groupShoesByName = (shoes) => {
    return shoes.reduce((acc, shoe) => {
      if (!acc[shoe.shoeName]) {
        acc[shoe.shoeName] = [];
      }
      acc[shoe.shoeName].push(shoe);
      return acc;
    }, {});
  };

  // PDF үүсгэх функц
  const generatePDF = async () => {
    // Гутлуудыг нэрээр нь ангилах
    const groupedShoes = groupShoesByName(shoes);

    // HTML үүсгэх
    let htmlContent = `<h1>A09 кодтой гутлуудын жагсаалт</h1>`;

    for (const shoeName in groupedShoes) {
      const shoeList = groupedShoes[shoeName];
      htmlContent += `<h2>${shoeName}</h2>`;
      shoeList.forEach((shoe) => {
        htmlContent += `<p>${shoe.shoeCode} ${shoe.shoeName} - ${shoe.shoeSize} - ${shoe.shoePrice}</p>`;
      });
    }

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("PDF файл үүсгэгдлээ:", uri);

      // PDF-ийг хуваалцах
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("PDF үүсгэхэд алдаа гарлаа:", error);
    }
  };

  return (
    <View>
      <Button title="PDF үүсгэх" onPress={generatePDF} />
    </View>
  );
};

export default A09ShoeListScreen;
