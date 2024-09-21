import React from "react";
import { View, Image, StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-paper";

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
  const methods = [
    {
      label: "Шууд төлөлт",
      value: "Шууд төлөлт",
      image: require("../assets/payment/deposit.png"),
    },
    {
      label: "Storepay",
      value: "Storepay",
      image: require("../assets/payment/storepay_logo.png"),
    },
    {
      label: "Pocket",
      value: "Pocket",
      image: require("../assets/payment/pocket_logo.png"),
    },
    {
      label: "Lendpay",
      value: "Lend",
      image: require("../assets/payment/lendmn_logo.png"),
    },
    {
      label: "Leasing",
      value: "Leasing",
      image: require("../assets/payment/leasing.png"),
    },
  ];

  return (
    <View style={styles.container}>
      {methods.map((method) => (
        <Pressable
          key={method.value}
          onPress={() => onSelect(method.value)}
          style={[
            styles.option,
            selectedMethod === method.value && styles.selectedOption,
          ]}
        >
          <Image source={method.image} style={styles.image} />
          <Text>{method.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  option: {
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  selectedOption: {
    borderColor: "#219ebc",
    backgroundColor: "#8ecae6",
  },
  image: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
});

export default PaymentMethodSelector;
