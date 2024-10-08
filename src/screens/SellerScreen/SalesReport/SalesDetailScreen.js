import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert, // Alert ашиглана
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
  deleteDoc,
} from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons"; // For the add button

import ExpenseModal from "../../../components/ExpenseModal"; // ExpenseModal-ыг импорт хийж байна

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

  // Тайлбар хадгалах функц
  const handleSaveComment = async () => {
    try {
      const db = getFirestore();
      const salesReportRef = doc(db, "salesReport", salesReport.id);
      await updateDoc(salesReportRef, {
        comment, // Тайлбарын утгыг шинэчилнэ
      });
      alert("Тайлбар амжилттай хадгалагдлаа.");
    } catch (error) {
      console.error("Тайлбар хадгалахад алдаа гарлаа: ", error);
      alert("Тайлбар хадгалахад алдаа гарлаа.");
    }
  };

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

  const handleSubmitReport = async () => {
    try {
      const db = getFirestore();
      const salesReportRef = doc(db, "salesReport", salesReport.id);
      await updateDoc(salesReportRef, {
        isReviewed: false, // Change to false when submitted
      });
      alert("Тайлан амжилттай илгээгдлээ.");
    } catch (error) {
      console.error("Тайлан илгээхэд алдаа гарлаа: ", error);
      alert("Тайлан илгээхэд алдаа гарлаа.");
    }
  };

  // Delete report function
  const handleDeleteReport = async () => {
    Alert.alert(
      "Устгах",
      "Та энэ тайланг устгахдаа итгэлтэй байна уу?",
      [
        {
          text: "Цуцлах",
          style: "cancel",
        },
        {
          text: "Устгах",
          onPress: async () => {
            try {
              const db = getFirestore();
              await deleteDoc(doc(db, "salesReport", salesReport.id)); // Delete the sales report
              alert("Тайлан амжилттай устгагдлаа.");
              navigation.goBack(); // Navigate back after deletion
            } catch (error) {
              console.error("Тайлан устгахад алдаа гарлаа: ", error);
              alert("Тайлан устгахад алдаа гарлаа.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleAddIncome = () => {
    Alert.alert(
      "Зардлын төрөл өө сонгоно уу!",
      "Аль нэгийг нь сонгоно уу?",
      [
        {
          text: "Бусад зардал оруулах",
          onPress: () => {
            // Бусад зардал оруулах хэсэг
            console.log("Бусад зардал оруулна.");
            // Та энд бусад зардал нэмэх логикийг оруулж болно.
            // Жишээ нь, зардлыг нэмж Firebase дээр хадгалах.
            setModalVisible(true);
          },
        },
        {
          text: "Орлого нэмэх",
          onPress: () => {
            navigation.navigate("IncomeAddScreen", {
              salesReport,
              onIncomeAdded: fetchSalesDetails, // Орлого нэмсний дараа мэдээллийг шинэчлэх функц
            });
          },
        },
        { text: "Буцах", style: "cancel" },
      ],
      { cancelable: true }
    );
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
                placeholder="Бусад зардал болон тэмдэглэх зүйлс..."
                multiline
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveComment}
              >
                <Text style={styles.buttonText}>Хадгалах</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              {/* Submit button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitReport}
              >
                <Text style={styles.submitButtonText}>Илгээх</Text>
              </TouchableOpacity>

              {/* Delete button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteReport}
              >
                <Text style={styles.deleteButtonText}>Устгах</Text>
              </TouchableOpacity>
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

      {/* Нэмэх товч нь absolute байрлалтай */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
        <AntDesign name="plus" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* ExpenseModal-г дуудах */}
      <ExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveExpense} // Зардал нэмэх функц
      />
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
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
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
  buttonContainer: {
    flexDirection: "row", // Aligns buttons horizontally
    justifyContent: "space-between", // Space between the buttons
    marginTop: 20, // Adjust margin as needed
  },
  submitButton: {
    flex: 1, // Makes the button take equal space
    backgroundColor: "#219ebc", // Submit button color
    padding: 15, // Adjust padding as needed
    borderRadius: 10,
    marginRight: 10, // Space between buttons
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  deleteButton: {
    flex: 1, // Makes the button take equal space
    backgroundColor: "#FF6961", // Delete button color
    padding: 15, // Adjust padding as needed
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default SalesDetailScreen;
