import React from "react";
import { View, Text } from "react-native";
import { VictoryChart, VictoryLine } from "victory-native";

const RevenueChartComponent = ({ branches }) => {
  const data = branches.map((branch) => ({
    x: new Date(),
    y: Math.floor(Math.random() * 1000), // Replace with real data
  }));

  return (
    <View>
      <Text>Revenue Chart</Text>
      <VictoryChart>
        <VictoryLine data={data} />
      </VictoryChart>
    </View>
  );
};

export default RevenueChartComponent;
