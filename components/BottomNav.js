import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";
import AddShoeScreen from "../screens/AddShoeScreen";
import RevenueReportScreen from "../screens/RevenueReportScreen";
import AccountScreen from "../screens/AccountScreen";
import NewScreen from "../screens/newScreen";
import TailanScreen from "../screens/tailanScreen";

const BottomNav = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Эхлэл", focusedIcon: "home" },
    { key: "addShoe", title: "Бүртгэл", focusedIcon: "plus-box" },
    { key: "revenue", title: "Орлого", focusedIcon: "file-plus" },
    { key: "account", title: "Хэрэглэгч", focusedIcon: "account" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "home":
        return <HomeScreen />;
      case "addShoe":
        return <NewScreen />;
      case "revenue":
        return <TailanScreen />;
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
    />
  );
};

export default BottomNav;
