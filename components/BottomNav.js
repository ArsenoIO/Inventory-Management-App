import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";
import AddShoeScreen from "../screens/AddShoeScreen";
import RevenueReportScreen from "../screens/RevenueReportScreen";
import AccountScreen from "../screens/AccountScreen";
import Dashboard from "../screens/DashBoard";

const BottomNav = () => {
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
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
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#ced4da",
      }}
      activeColor="#ffb703"
      inactiveColor="#1F1717"
      shifting={false} // Disable shifting to keep all labels visible
      sceneAnimationEnabled={false} // Disable animation for a smoother experience
    />
  );
};

export default BottomNav;
