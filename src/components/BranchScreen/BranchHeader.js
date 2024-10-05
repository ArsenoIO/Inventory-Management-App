import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const BranchHeader = ({ branchId }) => {
  const [branchData, setBranchData] = useState(null);
  const [users, setUsers] = useState([]); // Хэрэглэгчдийн нэрсийг хадгалах state

  // Салбарын мэдээллийг татах функц
  const fetchBranchData = async () => {
    const db = getFirestore();
    const docRef = doc(db, "branches", branchId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setBranchData(docSnap.data());
    }
  };

  // Салбарын нэрээр хэрэглэгчдийг шүүж авах функц
  const fetchUsers = async () => {
    const db = getFirestore();
    const usersCollection = collection(db, "users");

    // Салбарын нэрээр users цуглуулгад шүүлт хийж байна
    const q = query(
      usersCollection,
      where("branch", "==", branchData.branchName)
    );
    const querySnapshot = await getDocs(q);

    // Хэрэглэгчдийн нэрсийг state-д хадгалах
    const userList = querySnapshot.docs.map((doc) => doc.data().userName); // name талбараас нэрсийг нь авна
    setUsers(userList);
  };

  useEffect(() => {
    fetchBranchData();
  }, [branchId]);

  useEffect(() => {
    if (branchData) {
      fetchUsers(); // Салбарын мэдээлэл байгаа үед хэрэглэгчдийн нэрсийг татах функцыг дуудах
    }
  }, [branchData]);

  if (!branchData) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.line} />
        <Text style={styles.branchName}>{branchData.branchName}</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.totalShoe}>{branchData.totalShoe}</Text>
        <View style={styles.separator} />
        <View>
          {users.length > 0 ? (
            users.map((user, index) => (
              <Text key={index} style={styles.userName}>
                {user}
              </Text>
            ))
          ) : (
            <Text style={styles.userName}>Хэрэглэгч олдсонгүй.</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "black",
  },
  branchName: {
    marginHorizontal: 10,
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalShoe: {
    fontSize: 48,
    fontWeight: "bold",
    color: "green",
  },
  separator: {
    height: 60,
    width: 1,
    backgroundColor: "black",
    marginHorizontal: 20,
  },
  userName: {
    fontSize: 18,
    color: "#003f5c",
  },
});

export default BranchHeader;
