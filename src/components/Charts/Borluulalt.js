import React from "react";
import { Card, Title } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import { Dimensions, StyleSheet } from "react-native";

const Borluulalt = ({ title, data }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}>{title}</Title>
        <BarChart
          data={data}
          width={Dimensions.get("window").width - 70} // Графикийн өргөн
          height={250}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: "#D3D3D3",
            backgroundGradientFrom: "#2f4F4F",
            backgroundGradientTo: "#2f4F4F",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 2,
            borderRadius: 10,
          }}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    backgroundColor: "#F5F7F8", // Customize card background color if needed
    height: 350,
  },
  cardTitle: {
    fontSize: 18,
    color: "#45474B", // Custom color for card title
    fontWeight: "bold",
  },
});

export default Borluulalt;
