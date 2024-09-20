import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// Firebase-тай холбогдох функц
const checkShoesStatus = async () => {
  const db = getFirestore();

  try {
    // 1. isSold=true гутлуудыг шүүх
    const soldShoesQuery = query(
      collection(db, "shoes"),
      where("isSold", "==", true)
    );
    const soldShoesSnapshot = await getDocs(soldShoesQuery);

    const soldShoesCount = soldShoesSnapshot.docs.length;
    console.log(`Зарагдсан гутлын тоо: ${soldShoesCount}`);

    soldShoesSnapshot.docs.forEach((doc) => {
      console.log(
        `Зарагдсан гутал - Код: ${doc.data().shoeCode}, Нэр: ${
          doc.data().shoeName
        }`
      );
    });

    // 2. isSold=false гутлуудыг шүүх
    const unsoldShoesQuery = query(
      collection(db, "shoes"),
      where("isSold", "==", false)
    );
    const unsoldShoesSnapshot = await getDocs(unsoldShoesQuery);

    const unsoldShoesCount = unsoldShoesSnapshot.docs.length;
    console.log(
      `Бүртгэлтэй байгаа гутлын тоо (худалдаалаагүй): ${unsoldShoesCount}`
    );
  } catch (error) {
    console.error("Алдаа гарлаа:", error);
  }
};

// Функцийг дуудах
checkShoesStatus();
