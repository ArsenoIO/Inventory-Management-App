import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons"; // For the delete icon

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const ShoeDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const shoe = route.params.shoe; // Passed shoe data
  const db = getFirestore();

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "shoes", shoe.code)); // Firestore дээрх гутлыг устгах
      Alert.alert("Амжилттай", "Гутал амжилттай устгагдлаа.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        }, // Буцаад гутлын жагсаалт руу шилжих
      ]);
    } catch (error) {
      console.error("Гутал устгахад алдаа гарлаа:", error);
      Alert.alert("Алдаа", "Гутал устгахад алдаа гарлаа.");
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Устгах уу?",
      "Та энэ гутлыг устгахдаа итгэлтэй байна уу?",
      [
        { text: "Үгүй", style: "cancel" },
        { text: "Тийм", onPress: handleDelete },
      ],
      { cancelable: true }
    );
  };

  React.useLayoutEffect(() => {
    // Header дээр устгах icon-ийг нэмэх
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={confirmDelete}>
          <Ionicons
            name="trash"
            size={24}
            color="red"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: shoe.imageUrl }} style={styles.image} />

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Код:</Text>
        <Text style={styles.detailValue}>{shoe.code || "Мэдээлэл алга"}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Нэр:</Text>
        <Text style={styles.detailValue}>
          {shoe.name !== "null" ? shoe.name : "Нэр байхгүй"}
        </Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Үнэ:</Text>
        <Text style={styles.detailValue}>
          {shoe.price ? `${shoe.price}₮` : "Үнэ байхгүй"}
        </Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Размер:</Text>
        <Text style={styles.detailValue}>{shoe.size || "Размер байхгүй"}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Нэмсэн салбар:</Text>
        <Text style={styles.detailValue}>
          {shoe.addedBranch || "Мэдээлэл алга"}
        </Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Нэмсэн хэрэглэгч:</Text>
        <Text style={styles.detailValue}>
          {shoe.addedUserID || "Мэдээлэл алга"}
        </Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Борлуулсан эсэх:</Text>
        <Text style={styles.detailValue}>{shoe.isSold ? "Тийм" : "Үгүй"}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Худалдан авагчийн утасны дугаар:</Text>
        <Text style={styles.detailValue}>
          {shoe.buyerPhoneNumber || "Утасны дугаар байхгүй"}
        </Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Борлуулсан огноо:</Text>
        <Text style={styles.detailValue}>
          {shoe.soldDate
            ? shoe.soldDate.toDate().toLocaleDateString()
            : "Борлуулсан огноо байхгүй"}
        </Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Борлуулсан салбар:</Text>
        <Text style={styles.detailValue}>
          {shoe.soldBranch || "Мэдээлэл алга"}
        </Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Борлуулсан үнэ:</Text>
        <Text style={styles.detailValue}>
          {shoe.soldPrice ? `${shoe.soldPrice}₮` : "Мэдээлэл алга"}
        </Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Төлбөрийн хэлбэр:</Text>
        <Text style={styles.detailValue}>
          {shoe.transactionMethod || "Мэдээлэл алга"}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  image: {
    width: "70%",
    height: width * 0.8,
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  detailValue: {
    fontSize: 16,
    color: "#000",
    textAlign: "right",
  },
});

export default ShoeDetailScreen;
