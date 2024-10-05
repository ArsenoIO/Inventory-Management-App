import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

const SalesDetailScreen = ({ route, navigation }) => {
  const { salesReport } = route.params; // route-аас salesReport дамжуулсан утгыг авна
  const [salesDetails, setSalesDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState(salesReport.comment || ""); // Тайлбарын утга

  const [modalVisible, setModalVisible] = useState(false); // Modal-ийн харагдах төлөв

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

  // Зардал нэмэх функц
  const handleSaveExpense = async (expenseAmount, newComment) => {
    try {
      const db = getFirestore();
      const salesReportRef = doc(db, "salesReport", salesReport.id);

      // Update the expense and comment
      const updatedExpenses = salesReport.expenses + parseFloat(expenseAmount);
      const updatedComment = comment ? `${comment}, ${newComment}` : newComment;

      // Recalculate totalIncome
      const updatedTotalIncome = salesReport.income - updatedExpenses;

      await updateDoc(salesReportRef, {
        expenses: updatedExpenses,
        comment: updatedComment,
        totalIncome: updatedTotalIncome, // Recalculate totalIncome
      });

      setComment(updatedComment);
      salesReport.expenses = updatedExpenses; // Update state
      alert("Зардал амжилттай нэмэгдлээ!");
      fetchSalesDetails(); // Refresh the sales details
    } catch (error) {
      console.error("Зардал нэмэхэд алдаа гарлаа: ", error);
      alert("Зардал нэмэхэд алдаа гарлаа.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Тайлангийн мэдээллийн хэсэг */}
        <View style={styles.reportSection}>
          <View style={styles.reportItem}>
            <Text>Гутлын орлого:</Text>
            <Text style={styles.incomeText}>{salesReport.income}₮</Text>
          </View>
          <View style={styles.reportItem}>
            <Text>Зарагдсан гутал:</Text>
            <Text style={styles.saleText}>{salesReport.totalSales}</Text>
          </View>
          <View style={styles.reportItem}>
            <Text>Үүсгэсэн:</Text>
            <Text>{salesReport.createdBy}</Text>
          </View>
          <View style={styles.reportItem}>
            <Text>Зардал:</Text>
            <Text style={styles.expenseText}>{salesReport.expenses}₮</Text>
          </View>
          <View style={styles.reportItem}>
            <Text>Орлого:</Text>
            <Text style={styles.incomeText}>{salesReport.totalIncome}₮</Text>
          </View>
          <View>
            {/* Тайлбар бичих хэсэг */}
            <View style={styles.commentContainer}>
              <Text style={styles.commentTitle}>Тэмдэглэл:</Text>
              <TextInput
                value={comment}
                onChangeText={setComment}
                style={styles.commentInput}
                editable={false}
                placeholder="Бусад зардал болон тэмдэглэх зүйлс..."
                multiline
              />
            </View>
          </View>
        </View>

        {/* Гутлын дэлгэрэнгүй хэсэг */}
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Орлогын дэлгэрэнгүй</Text>
          {loading ? (
            <Text>Ачааллаж байна...</Text>
          ) : (
            salesDetails.map((detail) => (
              <View key={detail.id} style={styles.shoeCard}>
                <Image
                  source={{ uri: detail.ImageUrl }}
                  style={styles.shoeImage}
                />
                <View style={styles.shoeInfo}>
                  <Text style={styles.shoeText}>
                    Код: {detail.shoeCode} | {detail.shoeName || "Хоосон"}
                  </Text>
                  <Text style={styles.shoeText}>
                    Үндсэн үнэ: {detail.shoePrice}₮
                  </Text>
                  <Text style={styles.shoeText}>
                    Зарсан үнэ: {detail.soldPrice}₮
                  </Text>
                  <Text style={styles.shoeText}>Размер: {detail.shoeSize}</Text>
                  <Text style={styles.shoeText}>
                    Утасны дугаар: {detail.buyerPhoneNumber}
                  </Text>
                  <Text style={styles.shoeText}>
                    Төлбөрийн хэлбэр: {detail.transactionMethod}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
    borderRadius: 10,
    marginBottom: 20,
  },
  reportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  incomeText: {
    color: "green",
    fontWeight: "bold",
  },
  saleText: {
    fontWeight: "bold",
    color: "#FF6347",
  },
  expenseText: {
    color: "red",
    fontWeight: "bold",
  },
  detailSection: {
    backgroundColor: "#F1F1F1",
    padding: 16,
    borderRadius: 10,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
  },
  shoeCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  shoeImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 10,
  },
  shoeInfo: {
    flex: 1,
  },
  shoeText: {
    marginBottom: 5,
    fontSize: 14,
  },
});

export default SalesDetailScreen;
