import React, { useState } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  getDoc,
} from "firebase/firestore";
import BranchHeader from "../components/BranchScreen/BranchHeader";
import ShoeStatistics from "../components/BranchScreen/ShoeStatistics";
import SalesGraph from "../components/BranchScreen/SalesGraph";

const BranchDetailScreen = ({ route }) => {
  const { branchId } = route.params; // Route-аас дамжсан branchId
  const [refreshing, setRefreshing] = useState(false); // Refresh state

  // Refresh хийх үед ажиллах функц
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const db = getFirestore();

      // 1. branchId-аас branchName-ийг татаж авах
      const branchRef = doc(db, "branches", branchId);
      const branchSnap = await getDoc(branchRef);

      if (branchSnap.exists()) {
        const branchName = branchSnap.data().branchName; // branchName-ийг татаж авна
        console.log(branchName);
        // 2. shoes цуглуулгаас гутлуудыг branchName-ээр шүүх
        const shoesCollection = collection(db, "shoes");
        const q = query(
          shoesCollection,
          where("addedBranch", "==", branchName)
        ); // addedBranch-аар шүүх
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.size);
        const sizeStats = [];
        const priceStats = [];

        // 3. shoes цуглуулгаас өгөгдөл боловсруулах
        querySnapshot.forEach((doc) => {
          const shoe = doc.data();
          // Гутлын размерын статистик
          const sizeStat = sizeStats.find(
            (stat) => stat.size === shoe.shoeSize
          );
          console.log(sizeStat);
          if (sizeStat) {
            sizeStat.count += 1; // Хэрэв размер аль хэдийн байвал тоог нэмэгдүүлнэ
          } else {
            sizeStats.push({ size: shoe.shoeSize, count: 1 });
          }
          // Үнийн статистик

          const priceRange =
            shoe.shoePrice <= 650000
              ? "650000 хүртэл"
              : shoe.shoePrice <= 750000
              ? "650000-750000"
              : shoe.shoePrice <= 850000
              ? "750000-850000"
              : shoe.shoePrice <= 950000
              ? "850000-950000"
              : shoe.shoePrice <= 1050000
              ? "950000-1050000"
              : shoe.shoePrice <= 1150000
              ? "1050000-1150000"
              : shoe.shoePrice <= 1250000
              ? "1150000-1250000"
              : shoe.shoePrice <= 1350000
              ? "1250000-1350000"
              : shoe.shoePrice <= 1450000
              ? "1350000-1450000"
              : shoe.shoePrice <= 1550000
              ? "1450000-1550000"
              : shoe.shoePrice <= 1650000
              ? "1550000-1650000"
              : shoe.shoePrice <= 1750000
              ? "1650000-1750000"
              : shoe.shoePrice <= 1850000
              ? "1750000-1850000"
              : "1850000-с дээш"; // 1,850,000-с дээш үнийн дүн

          const priceStat = priceStats.find(
            (stat) => stat.priceRange === priceRange
          );

          if (priceStat) {
            priceStat.count += 1; // Хэрэв priceRange давтагдсан бол тоог нэмэгдүүлнэ
          } else {
            priceStats.push({ priceRange, count: 1 }); // Шинэ үнийн дүнгийн бүлэг үүсгэнэ
          }
        });

        // 4. shoeStatistics цуглуулгад шинэчлэгдсэн өгөгдлийг хадгалах
        const statisticsRef = doc(db, "shoeStatistics", branchId);
        await setDoc(statisticsRef, { sizeStats, priceStats });

        console.log("ShoeStatistics цуглуулга шинэчлэгдлээ.");
      } else {
        console.log("Branch өгөгдөл олдсонгүй.");
      }
    } catch (error) {
      console.error("Өгөгдөл шинэчлэхэд алдаа гарлаа: ", error);
    }

    setRefreshing(false); // RefreshControl-д шинэчлэл дууссаныг мэдэгдэх
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <BranchHeader branchId={branchId} />
      <ShoeStatistics branchId={branchId} />
      <SalesGraph branchId={branchId} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
});

export default BranchDetailScreen;
