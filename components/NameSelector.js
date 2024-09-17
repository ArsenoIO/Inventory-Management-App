import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const NameSelector = ({ selectedName, onSelect }) => {
  const [names, setNames] = useState([]);

  useEffect(() => {
    const fetchNames = async () => {
      const db = getFirestore();
      const namesCollection = collection(db, "names");
      const nameSnapshot = await getDocs(namesCollection);
      const nameList = nameSnapshot.docs.map((doc) => doc.id); // Getting document IDs
      setNames(nameList);
    };

    fetchNames();
  }, []);

  return (
    <View style={styles.container}>
      {names.map((name) => (
        <Pressable
          key={name}
          onPress={() => onSelect(name)}
          style={[
            styles.option,
            selectedName === name && styles.selectedOption,
          ]}
        >
          <Text style={styles.text}>{name}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    justifyContent: "space-between",
  },
  option: {
    width: 40,
    height: 40,
    borderWidth: 0.5,
    marginBottom: 5,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectedOption: {
    borderColor: "#219ebc",
    backgroundColor: "#8ecae6",
  },
  text: {
    fontSize: 13,
  },
});
export default NameSelector;
