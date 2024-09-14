import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BranchSelector = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button
        title="Төв салбар"
        onPress={() => navigation.navigate("CentralBranch")}
      />
      <Button
        title="Өвөрхангай салбар"
        onPress={() => navigation.navigate("UvurkhangaiBranch")}
      />
      <Button
        title="Бөмбөгөр салбар"
        onPress={() => navigation.navigate("BumbugurBranch")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
});

export default BranchSelector;
