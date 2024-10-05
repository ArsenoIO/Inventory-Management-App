import React from "react";
import {
  VictoryLine,
  VictoryAxis,
  VictoryTooltip,
  VictoryChart,
  VictoryTheme,
} from "victory-native";
import { ScrollView, View, Text } from "react-native";

const VictoryLineChart = ({ data, x, y, color }) => {
  if (!data || data.length === 0) {
    return <Text>Data not available</Text>; // Fallback UI when data is undefined or empty
  }

  return (
    <ScrollView horizontal={true}>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLine
          data={data}
          x={x}
          y={y}
          style={{
            data: { stroke: color || "#fdd835", strokeWidth: 2 },
          }}
          labels={({ datum }) => `${datum[y]}`}
          labelComponent={<VictoryTooltip style={{ fontSize: 10 }} />}
        />
        <VictoryAxis
          style={{
            tickLabels: { fontSize: 10, padding: 5, fill: "#333" },
          }}
          tickFormat={(t) =>
            new Date(t).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          } // Formats the ticks as dates
        />
      </VictoryChart>
    </ScrollView>
  );
};

export default VictoryLineChart;
