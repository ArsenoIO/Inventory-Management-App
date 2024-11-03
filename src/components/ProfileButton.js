import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";

const ProfileButton = ({ initials, name, shoes, balance, loan, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.leftSection}>
        <Avatar.Icon size={60} icon="account" style={styles.avatar} />
        <Text style={styles.initials}>{initials}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.rightSection}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.detailText}>Гутал: {shoes || "-"}</Text>
        <Text style={styles.detailText}>Үлдэгдэл тооцоо: {balance || "-"}</Text>
        <Text style={styles.detailText}>Зээл: {loan || "-"}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  leftSection: {
    alignItems: "center",
    marginRight: 10,
    marginLeft: 10,
  },
  avatar: {
    backgroundColor: "#FF4081",
  },
  initials: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#ccc",
    marginHorizontal: 10,
  },
  rightSection: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: "green",
    marginBottom: 2,
  },
});

export default ProfileButton;
