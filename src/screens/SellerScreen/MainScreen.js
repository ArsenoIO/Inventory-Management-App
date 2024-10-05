import React from "react";
import { View, StyleSheet, Text, Dimensions, ScrollView } from "react-native";
import MainButton from "../../components/MainButton"; // MainButton-г импортолж байна
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const MainScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.buttonContainer}>
          <MainButton
            title="САЛБАРЫН МЭДЭЭЛЭЛ"
            onPress={() => navigation.navigate("BranchScreen")}
            bgColor="#00BF63"
            iconSource={require("../../assets/branchDetail.png")} // Зургийн замыг оруулж байна
          />
          <MainButton
            title="ГУТАЛ БҮРТГЭЛ"
            onPress={() => navigation.navigate("AddShoeScreen")}
            bgColor="#FFDE59"
            iconSource={require("../../assets/shoeRegistration.png")}
          />
          <MainButton
            title="ОРЛОГЫН ТАЙЛАН"
            onPress={() => navigation.navigate("SalesReportScreen")}
            bgColor="#FF5757"
            iconSource={require("../../assets/reportDaily.png")}
          />
          <MainButton
            title="ГУТЛЫН САН"
            onPress={() => navigation.navigate("ShoeDatabase")}
            bgColor="#5E17EB"
            iconSource={require("../../assets/database.png")}
          />
          <MainButton
            title="ГУТАЛ САЛБАР ЛУУ ИЛГЭЭХ"
            onPress={() => navigation.navigate("ChangeBranchScreen")}
            bgColor="#5CE1E6"
            iconSource={require("../../assets/changeBranch.png")}
          />

          <MainButton
            title="ХУВЬ ЛИЗИНГ"
            onPress={() => navigation.navigate("Leasing")}
            bgColor="#FE904D"
            iconSource={require("../../assets/changeBranch.png")}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: height * 0.05,
  },

  scrollContainer: {
    paddingBottom: 2, // Extra space at the bottom
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: width,
  },
});
