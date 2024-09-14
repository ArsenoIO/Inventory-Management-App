import React, { useState, useEffect } from "react";
import { BottomNavigation } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";
import AddShoeScreen from "../screens/AddShoeScreen";
import RevenueReportScreen from "../screens/RevenueReportScreen";
import AccountScreen from "../screens/AccountScreen";
import TripScreen from "../screens/AdminScreen/TripScreen"; // Шинэ Аялал дэлгэц
import { auth, firestore } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const BottomNav = () => {
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {
      key: "home",
      title: "Эхлэл",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "addShoe",
      title: "Бүртгэл",
      focusedIcon: "plus-box",
      unfocusedIcon: "plus-box-outline",
    },
    {
      key: "revenue",
      title: "Орлого",
      focusedIcon: "file-plus",
      unfocusedIcon: "file-plus-outline",
    },
    {
      key: "account",
      title: "Хэрэглэгч",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "home":
        return <HomeScreen />;
      case "addShoe":
        return <AddShoeScreen />;
      case "revenue":
        return <RevenueReportScreen />;
      case "account":
        return <AccountScreen />;
      case "trip":
        return <TripScreen />; // Аялал дэлгэцийг харуулна
      default:
        return null;
    }
  };

  // Хэрэглэгчийн мэдээлэл авах ба админ бол маршрутуудыг шинэчлэх
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.userRole === "admin") {
            setRoutes((prevRoutes) =>
              prevRoutes.map((route) =>
                route.key === "addShoe"
                  ? {
                      ...route,
                      key: "trip",
                      title: "Аялал",
                      focusedIcon: "airplane",
                      unfocusedIcon: "airplane",
                    }
                  : route
              )
            );
          }
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{
        backgroundColor: "#FFFBFF",
        borderTopWidth: 0.7,
        borderTopColor: "#ced4da",
      }}
      activeColor="#ffb703"
      activeIndicatorStyle={{ backgroundColor: "#FFFBFF" }}
      inactiveColor="#1F1717"
      sceneAnimationEnabled={false} // Хөдөлгөөнийг хаасан
    />
  );
};

export default BottomNav;
