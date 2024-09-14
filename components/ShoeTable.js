// ShoeTable.js
import React from "react";
import { ScrollView } from "react-native";
import { DataTable } from "react-native-paper";

const ShoeTable = ({ shoesList, handleLongPress }) => {
  return (
    <ScrollView horizontal={true}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title
            style={{ paddingHorizontal: 10, textAlign: "center" }}
          >
            Гутлын Код
          </DataTable.Title>
          <DataTable.Title
            style={{ paddingHorizontal: 10, textAlign: "center" }}
          >
            Нэр
          </DataTable.Title>
          <DataTable.Title
            numeric
            style={{ paddingHorizontal: 10, textAlign: "center" }}
          >
            Размер
          </DataTable.Title>
          <DataTable.Title
            numeric
            style={{ paddingHorizontal: 10, textAlign: "center" }}
          >
            Үнэ
          </DataTable.Title>
          <DataTable.Title
            style={{ paddingHorizontal: 10, textAlign: "center" }}
          >
            Салбар
          </DataTable.Title>
          <DataTable.Title
            style={{ paddingHorizontal: 10, textAlign: "center" }}
          >
            Хэрэглэгч
          </DataTable.Title>
        </DataTable.Header>

        {shoesList.map((shoe, index) => (
          <DataTable.Row
            key={index}
            onLongPress={() => handleLongPress(shoe)}
            style={{ paddingHorizontal: 10 }}
          >
            <DataTable.Cell style={{ paddingHorizontal: 10 }}>
              {shoe.shoeCode}
            </DataTable.Cell>
            <DataTable.Cell style={{ paddingHorizontal: 10 }}>
              {shoe.shoeName}
            </DataTable.Cell>
            <DataTable.Cell numeric style={{ paddingHorizontal: 10 }}>
              {shoe.shoeSize}
            </DataTable.Cell>
            <DataTable.Cell numeric style={{ paddingHorizontal: 10 }}>
              {shoe.shoePrice}
            </DataTable.Cell>
            <DataTable.Cell style={{ paddingHorizontal: 10 }}>
              {shoe.addedBranch}
            </DataTable.Cell>
            <DataTable.Cell style={{ paddingHorizontal: 10 }}>
              {shoe.addedUserID}
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
};

export default ShoeTable;
