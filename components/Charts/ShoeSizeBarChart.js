// components/ShoeSizeBarChart.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const CHART_HEIGHT = 250;
const CHART_WIDTH = Dimensions.get("window").width - 20; // Графикийг голд нь харагдуулахын тулд өргөнийг тохируулсан

const ShoeSizeBarChart = ({ branchName }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSizeData = async () => {
      setLoading(true);
      const firestore = getFirestore();
      const shoesRef = collection(firestore, "shoes");

      let q;
      if (Array.isArray(branchName)) {
        q = query(shoesRef, where("isSold", "==", false));
      } else {
        q = query(
          shoesRef,
          where("addedBranch", "==", branchName),
          where("isSold", "==", false)
        );
      }

      const querySnapshot = await getDocs(q);

      // Гутлын хэмжээг 35-45 хүртэлх бүлэгт ангилах
      const labels = [
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
      ];
      const sizeCounts = Array(labels.length).fill(0);

      querySnapshot.forEach((doc) => {
        const size = doc.data().shoeSize;
        const sizeIndex = labels.indexOf(size.toString());
        if (sizeIndex !== -1) {
          sizeCounts[sizeIndex]++;
        }
      });

      setChartData({
        labels,
        datasets: [{ data: sizeCounts }],
      });
      setLoading(false);
    };

    fetchSizeData();
  }, [branchName]);

  // Өнгө болон графикийн тохиргоо
  const chartConfig = {
    backgroundGradientFrom: "#FEFAE0",
    backgroundGradientTo: "#FEFAE0",
    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`, // Багануудын үндсэн жигд хөх өнгө
    labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`, // Шошго болон утгууд цагаан өнгөтэй
    barPercentage: 0.7, // Багануудын өргөнийг тохируулах
    propsForBackgroundLines: {
      strokeDasharray: "", // Цэгэн шугамыг арилгах
      strokeWidth: 0, // Арын шугамын өргөнийг 0 болгож арилгах
    },
    propsForDots: {
      r: "0", // Цэгүүдийн оронд баганууд дээр зөвхөн утгууд байх
    },
    fillShadowGradient: "#343131", // Багануудын тогтсон өнгө
    fillShadowGradientOpacity: 1,
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Ачааллаж байна...</Text>
      ) : (
        <BarChart
          data={chartData}
          width={CHART_WIDTH} // Графикийн өргөнийг багасгаж голлуулсан
          height={CHART_HEIGHT}
          chartConfig={chartConfig}
          verticalLabelRotation={0} // Тагийн шошгыг хэвээр хадгалсан
          showValuesOnTopOfBars // Баганан дээрх утгыг харуулна
          withInnerLines={false} // Арын шугамуудыг арилгах
          withHorizontalLabels={false} // Зүүн талын утгуудыг арилгах
          flatColor={true}
          style={{ borderColor: "#C0C78C", borderWidth: 1 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
});

export default ShoeSizeBarChart;
