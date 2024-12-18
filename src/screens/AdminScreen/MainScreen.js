import React from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import MainButton from "../../components/MainButton";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const AdminMainScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.buttonContainer}>
          <MainButton
            title="САЛБАРУУДЫН МЭДЭЭЛЭЛ"
            onPress={() => navigation.navigate("AdminBranchScreen")}
            bgColor="#00BF63"
            iconSource={require("../../assets/branchDetail.png")}
            textSize={styles.buttonText.fontSize}
          />
          <MainButton
            title="ОРЛОГЫН ТАЙЛАН"
            onPress={() => navigation.navigate("AdminSalesReportScreen")}
            bgColor="#FF5757"
            iconSource={require("../../assets/reportDaily.png")}
            textSize={styles.buttonText.fontSize}
          />
          <MainButton
            title="ГУТЛЫН САН"
            onPress={() => navigation.navigate("AdminShoeDatabase")}
            bgColor="#5E17EB"
            iconSource={require("../../assets/database.png")}
            textSize={styles.buttonText.fontSize}
          />
          <MainButton
            title="НИЙЛҮҮЛЭГЧДИЙН МЭДЭЭЛЭЛ"
            onPress={() => navigation.navigate("SuppliersInfoScreen")}
            bgColor="#5271FF"
            iconSource={require("../../assets/suppliersInfo.png")}
            textSize={styles.buttonText.fontSize}
          />
          <MainButton
            title="АЯЛАЛ"
            onPress={() => navigation.navigate("TripScreen")}
            bgColor="#FE904D"
            iconSource={require("../../assets/Trip.png")}
            textSize={styles.buttonText.fontSize}
          />
          <MainButton
            title="ХЭРЭГЛЭГЧДИЙН ХЯНАЛТ"
            onPress={() => navigation.navigate("AdminUserControl")}
            bgColor="#5CE1E6"
            iconSource={require("../../assets/profile.png")}
            textSize={styles.buttonText.fontSize}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminMainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: height * 0.05,
  },
  scrollContainer: {
    paddingBottom: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: width,
  },
  buttonText: {
    fontSize: width * 0.03, // Dynamic font size based on screen width
  },
});
