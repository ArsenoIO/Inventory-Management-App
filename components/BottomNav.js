import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";
import AddShoeScreen from "../screens/AddShoeScreen";
import RevenueReportScreen from "../screens/RevenueReportScreen";
import AccountScreen from "../screens/AccountScreen";
import MyHome from "../screens/MyHome";

const BottomNav = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Эхлэл", focusedIcon: "home-outline" },
    { key: "addShoe", title: "Бүртгэл", focusedIcon: "plus-box-outline" },
    { key: "revenue", title: "Орлого", focusedIcon: "file-plus-outline" },
    { key: "account", title: "Хэрэглэгч", focusedIcon: "account-outline" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "home":
        return <MyHome />;
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
