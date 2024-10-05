import React from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryTheme,
} from "victory-native";
import { ScrollView } from "react-native";

const CustomBarChart = ({
  data,
  xField,
  yField,
  labelFormatter,
  horizontal = false,
}) => {
  return (
    <ScrollView horizontal={true}>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: 10, y: 5 }} // Adds padding between bars
      >
        {/* X and Y Axis */}
        <VictoryAxis
          style={{
            axis: { stroke: "#756f6a" },
            tickLabels: { fontSize: 12, padding: 5, fill: "#333" }, // Styling for tick labels
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "#756f6a" },
            grid: { stroke: "#e6e6e6", strokeDasharray: "10, 5" }, // Gridline styling
            tickLabels: { fontSize: 12, fill: "#333" },
          }}
        />

        {/* Bar chart */}
        <VictoryBar
          data={data}
          x={xField}
          y={yField}
          horizontal={horizontal} // Allow flexibility for horizontal/vertical orientation
          barWidth={17}
          labels={labelFormatter} // Custom label function passed from parent
          style={{
            data: {
              fill: ({ index }) => (index % 2 === 0 ? "#fb8500" : "#023047"), // Alternating colors
              width: 15, // Bar width
            },
            labels: { fontSize: 12, fill: "black" }, // Label font styling
          }}
          labelComponent={
            <VictoryTooltip
              flyoutStyle={{ stroke: "none", fill: "transparent" }} // Tooltip background styling
              dy={-40}
              dx={-70}
              style={{ fontSize: 12, fontWeight: "bold", fill: "black" }} // Tooltip text styling
            />
          }
        />
      </VictoryChart>
    </ScrollView>
  );
};

export default CustomBarChart;
