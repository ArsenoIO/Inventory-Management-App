import React, { useEffect, useState } from "react";
import { View, Button } from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const A09ShoeListScreen = () => {
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    const fetchA09Shoes = async () => {
      const db = getFirestore();
      const shoesRef = collection(db, "shoes");

      // ТӨВ САЛБАР-аас өнөөдөр бүртгэсэн гутлуудыг шүүх
      const today = new Date();
      const todayString = today.toISOString().split("T")[0]; // Өнөөдрийн огноог YYYY-MM-DD форматаар авах

      const q = query(
        shoesRef,
        where("addedBranch", "==", "ТӨВ САЛБАР"),
        where("addedDate", "==", todayString) // Бүртгэсэн огноо нь өнөөдөртэй таарч байх нөхцөл
      );

      try {
        const querySnapshot = await getDocs(q);
        const shoesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShoes(shoesList);
      } catch (error) {
        console.error(
          "ТӨВ САЛБАР-ын өнөөдөр бүртгэсэн гутлуудыг авчрахад алдаа гарлаа:",
          error
        );
      }
    };

    fetchA09Shoes();
  }, []);

  const groupShoesByName = (shoes) => {
    return shoes.reduce((acc, shoe) => {
      if (!acc[shoe.shoeName]) {
        acc[shoe.shoeName] = [];
      }
      acc[shoe.shoeName].push(shoe);
      return acc;
    }, {});
  };

  const generatePDF = async () => {
    const groupedShoes = groupShoesByName(shoes);
    let htmlContent = `<h1>ТӨВ САЛБАР-ын өнөөдөр бүртгэсэн гутлуудын жагсаалт</h1>`;
    let counter = 1;

    for (const shoeName in groupedShoes) {
      const shoeList = groupedShoes[shoeName];
      htmlContent += `<h2>${shoeName}</h2>`;
      shoeList.forEach((shoe) => {
        htmlContent += `<p>${counter}. ${shoe.shoeCode} - ${shoe.shoeName} - Размер: ${shoe.shoeSize} - Үнэ: ${shoe.shoePrice}₮</p>`;
        counter++;
      });
    }

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("PDF файл үүсгэгдлээ:", uri);
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
