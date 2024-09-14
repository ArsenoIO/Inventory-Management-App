import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig"; // Firebase тохиргоотойгоо холбоно

// Шинэ аялал үүсгэх функц
export const createNewTrip = async (startDate, initialAmount) => {
  try {
    const db = getFirestore();

    // Шинэ аяллын default утгуудыг тохируулна
    const newTrip = {
      startDate: Timestamp.fromDate(startDate), // Огноог Timestamp болгон хадгална
      initialAmount: parseInt(initialAmount, 10), // Мөнгөн дүнг тоо болгон хадгална
      status: true, // Default статус нь идэвхтэй (true)
      totalShoes: 0, // Нийт гутал 0
      totalShoesAmount: 0, // Нийт гутлын дүн 0
      expensesAmount: 0, // Зардал 0
      otherExpensesAmount: 0, // Бусад зардал 0
      balanceAmount: parseInt(initialAmount, 10), // Бүх зардал 0 учир үлдэгдэл анхны мөнгөн дүнтэй тэнцэнэ
    };

    // Firestore руу шинэ аяллыг нэмнэ
    const docRef = await addDoc(collection(db, "trips"), newTrip);

    console.log("Шинэ аялал үүсгэгдлээ: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Аялал үүсгэхэд алдаа гарлаа: ", error);
    throw new Error(error);
  }
};

// Гутлын зардал нэмэх функц
export const addShoeExpense = async (
  tripId,
  shoesPurchased,
  shoeSupplier,
  costPerShoe
) => {
  try {
    const totalShoeCost = shoesPurchased * costPerShoe;
    await addDoc(collection(firestore, "tripDetails"), {
      tripId: tripId,
      shoesPurchased: shoesPurchased,
      shoeSupplier: shoeSupplier,
      costPerShoe: costPerShoe,
      totalShoeCost: totalShoeCost,
      type: "Гутлын зардал",
    });

    const tripDoc = doc(firestore, "trips", tripId);
    const tripSnap = await getDoc(tripDoc);
    const newBalance = tripSnap.data().balanceAmount - totalShoeCost;

    await updateDoc(tripDoc, { balanceAmount: newBalance });

    console.log("Гутлын зардал амжилттай нэмэгдлээ.");
  } catch (e) {
    console.error("Гутлын зардлыг нэмэхэд алдаа гарлаа: ", e);
  }
};

// Бусад зардал нэмэх функц
export const addOtherExpense = async (tripId, amount, description) => {
  try {
    await addDoc(collection(firestore, "tripDetails"), {
      tripId: tripId,
      amount: amount,
      description: description,
      type: "Бусад зардал",
    });

    const tripDoc = doc(firestore, "trips", tripId);
    const tripSnap = await getDoc(tripDoc);
    const newBalance = tripSnap.data().balanceAmount - amount;

    await updateDoc(tripDoc, { balanceAmount: newBalance });

    console.log("Бусад зардал амжилттай нэмэгдлээ.");
  } catch (e) {
    console.error("Бусад зардлыг нэмэхэд алдаа гарлаа: ", e);
  }
};

// Аяллын дэлгэрэнгүйг авах функц
export const getTripDetails = async (tripId) => {
  const q = query(
    collection(firestore, "tripDetails"),
    where("tripId", "==", tripId)
  );

  try {
    const querySnapshot = await getDocs(q);
    let tripDetails = [];
    querySnapshot.forEach((doc) => {
      tripDetails.push(doc.data());
    });
    return tripDetails;
  } catch (e) {
    console.error("Аяллын дэлгэрэнгүйг татахад алдаа гарлаа: ", e);
  }
};
