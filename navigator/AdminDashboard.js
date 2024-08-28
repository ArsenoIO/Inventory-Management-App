import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { VictoryChart, VictoryBar, VictoryAxis } from 'victory-native';
import { Card } from 'react-native-paper';

const AdminDashboard = () => {
  const [allBranchStats, setAllBranchStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllBranchStats = async () => {
      const statsRef = collection(firestore, "branch_stats");
      const statsSnapshot = await getDocs(statsRef);
      const statsList = statsSnapshot.docs.map(doc => doc.data());
      setAllBranchStats(statsList);
      setLoading(false);
    };

    fetchAllBranchStats();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>; // Display a loading state
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {allBranchStats.map((branch, index) => (
        <Card key={index} style={styles.card}>
          <Card.Title title={`Branch: ${branch.branchName}`} />
          <Card.Content>
            <Text>Total Sales: {branch.totalSales}</Text>
            <Text>Total Revenue: {branch.totalRevenue}</Text>
            <Text>Unsold Shoes: {branch.unsoldShoes}</Text>
            <VictoryChart domainPadding={20}>
              <VictoryAxis tickFormat={(x) => `${x}`} />
              <VictoryAxis dependentAxis tickFormat={(y) => `${y}`} />
              <VictoryBar data={branch.salesData} x="month" y="sales" />
            </VictoryChart>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
});

export default AdminDashboard;
