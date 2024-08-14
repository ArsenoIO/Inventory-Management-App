import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";
import AddShoeScreen from "../screens/AddShoeScreen";
import RevenueReportScreen from "../screens/RevenueReportScreen";
import AccountScreen from "../screens/AccountScreen";

const BottomNav = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Эхлэл", icon: "home" },
    { key: "addShoe", title: "Бүртгэл", icon: "plus-box" },
    { key: "revenue", title: "Орлого", icon: "file-plus" },
    { key: "account", title: "Хэрэглэгч", icon: "account" },
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
    />
  );
};

export default BottomNav;
