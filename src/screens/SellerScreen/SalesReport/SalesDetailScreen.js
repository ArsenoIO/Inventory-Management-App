import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons"; // For the add button

const SalesDetailScreen = ({ route, navigation }) => {
  const { salesReport } = route.params; // route-аас salesReport дамжуулсан утгыг авна
  const [salesDetails, setSalesDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSalesDetails = async () => {
    setLoading(true);
    const db = getFirestore();
    const salesDetailCollection = collection(db, "salesDetail");
    const salesDetailQuery = query(
      salesDetailCollection,
      where("saleID", "==", salesReport.id) // Зөвхөн тухайн тайлангийн saleID-г шүүж авна
    );
    const salesDetailSnapshot = await getDocs(salesDetailQuery);
    const salesDetailList = salesDetailSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Гутлын сангаас дэлгэрэнгүй мэдээллийг татах
    const shoeDetails = await Promise.all(
      salesDetailList.map(async (detail) => {
        const shoeDoc = await getDoc(doc(db, "shoes", detail.shoeCode)); // getDoc ашиглаж байна
        const shoeData = shoeDoc.exists() ? shoeDoc.data() : {}; // shoeCode-г ашиглан мэдээллийг авна

        return { ...detail, ...shoeData };
      })
    );

    setSalesDetails(shoeDetails); // Орлогын нийт нийлбэрийг хадгалах
    setLoading(false);
  };

  useEffect(() => {
    fetchSalesDetails();
  }, []);

  const handleAddIncome = () => {
    // Орлого нэмэх дэлгэц рүү шилжих үед одоогийн тайлангийн мэдээллийг дамжуулна
    navigation.navigate("IncomeAddScreen", {
      salesReport,
      onIncomeAdded: fetchSalesDetails, // Орлого нэмсний дараа мэдээллийг шинэчлэх функц
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.reportSection}>
          <Text style={styles.reportTitle}>Тайлангийн мэдээлэл</Text>
          <Text>Салбар: {salesReport.branch}</Text>
          <Text>Орлого: {salesReport.totalIncome}₮</Text>

          <Text>Нийт зарсан гутал: {salesReport.totalSales}</Text>
          <Text>Зардал: {salesReport.expenses}₮</Text>
          <Text>Нийт орлого: {salesReport.totalIncome}₮</Text>

          <Text>Тайлбар: {salesReport.comment}</Text>
          <Text>Үүсгэсэн: {salesReport.createdBy}</Text>
          <Text>
            Хянагдсан эсэх: {salesReport.isReviewed ? "Тийм" : "Үгүй"}
          </Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Орлогын дэлгэрэнгүй</Text>
          {loading ? (
            <Text>Ачааллаж байна...</Text>
          ) : (
            salesDetails.map((detail) => (
              <View key={detail.id} style={styles.shoeItem}>
                <Image
                  source={{ uri: detail.ImageUrl }}
                  style={styles.shoeImage}
                />
                <View style={styles.shoeInfo}>
                  <Text>
                    Код: {detail.shoeCode} | {detail.shoeName || "Хоосон"}
                  </Text>
                  <Text>Үндсэн үнэ: {detail.shoePrice}₮</Text>
                  <Text>Зарсан үнэ: {detail.soldPrice}₮</Text>

                  <Text>Размер: {detail.shoeSize}</Text>
                  <Text>Утасны дугаар: {detail.buyerPhoneNumber}</Text>
                  <Text>Төлбөрийн хэлбэр: {detail.paymenthMethod}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
        <AntDesign name="plus" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContainer: {
    padding: 16,
  },
  reportSection: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailSection: {
    backgroundColor: "#F1F1F1",
    padding: 16,
    borderRadius: 8,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  shoeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
  },
  shoeImage: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  shoeInfo: {
    flex: 1,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#03A9F4",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
});

export default SalesDetailScreen;
