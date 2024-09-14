import React from "react";
import { View, Text } from "react-native";
import { VictoryPie } from "victory-native";

const PieChartComponent = ({ branches }) => {
  const data = branches.map((branch) => ({
    x: branch,
    y: Math.floor(Math.random() * 100), // Replace with real data
  }));

  return (
    <View>
      <Text>Branch Shoe Distribution</Text>
      <VictoryPie data={data} />
    </View>
  );
};

export default PieChartComponent;
