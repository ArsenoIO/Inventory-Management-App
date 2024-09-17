import React from "react";
import { View, StyleSheet } from "react-native";
import MainButton from "../components/MainButton"; // MainButton-г импортолж байна
import { useNavigation } from "@react-navigation/native";

const MainScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <MainButton
          title="САЛБАРУУДЫН МЭДЭЭЛЭЛ"
          onPress={() => navigation.navigate("HomeScreen")}
          bgColor="#00BF63"
          iconSource={require("../assets/branchDetail.png")} // Зургийн замыг оруулж байна
        />
        <MainButton
          title="ГУТАЛ БҮРТГЭЛ"
          onPress={() => navigation.navigate("AddShoeScreen")}
          bgColor="#FFDE59"
          iconSource={require("../assets/shoeRegistration.png")}
        />
        <MainButton
          title="НИЙЛҮҮЛЭГЧДИЙН МЭДЭЭЛЭЛ"
          onPress={() => navigation.navigate("SuppliersInfoScreen")}
          bgColor="#5271FF"
          iconSource={require("../assets/suppliersInfo.png")}
        />
        <MainButton
          title="ОРЛОГЫН ТАЙЛАН ИЛГЭЭХ"
          onPress={() => navigation.navigate("RevenueReportScreen")}
          bgColor="#FF5757"
          iconSource={require("../assets/reportDaily.png")}
        />
        <MainButton
          title="ГУТЛЫН САН"
          onPress={() => navigation.navigate("ShoeDatabase")}
          bgColor="#5E17EB"
          iconSource={require("../assets/database.png")}
        />
        <MainButton
          title="ГУТАЛ САЛБАР ЛУУ ИЛГЭЭХ"
          onPress={() => navigation.navigate("ChangeBranchScreen")}
          bgColor="#5CE1E6"
          iconSource={require("../assets/changeBranch.png")}
        />
        <MainButton
          title="АЯЛАЛ"
          onPress={() => navigation.navigate("TripScreen")}
          bgColor="#FE904D"
          iconSource={require("../assets/Trip.png")}
        />
      </View>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
