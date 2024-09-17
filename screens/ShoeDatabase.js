import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons"; // Import icon library
import ShoeButton from "../components/ShoeButton";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const ITEMS_PER_PAGE = 20; // Number of shoes to load per page

const ShoeInventoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [shoes, setShoes] = useState([]);
  const [filteredShoes, setFilteredShoes] = useState([]); // Filtered shoes based on search query
  const [lastVisible, setLastVisible] = useState(null); // Store the last visible document
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // To check if more data is available

  const db = getFirestore();
  const navigation = useNavigation(); // Access navigation

  useEffect(() => {
    fetchShoes(); // Load initial shoes when the component mounts
  }, []);

  const fetchShoes = async (reset = false, search = false) => {
    setLoading(true);
    try {
      const shoesCollection = collection(db, "shoes");
      let shoesQuery = query(
        shoesCollection,
        orderBy("shoeName"),
        limit(ITEMS_PER_PAGE)
      );

      if (search && searchQuery) {
        // If searching, filter shoes by name
        shoesQuery = query(
          shoesCollection,
          where("shoeName", ">=", searchQuery),
          where("shoeName", "<=", searchQuery + "\uf8ff"),
          limit(ITEMS_PER_PAGE)
        );
      } else if (lastVisible && !reset) {
        shoesQuery = query(
          shoesCollection,
          orderBy("shoeName"),
          startAfter(lastVisible),
          limit(ITEMS_PER_PAGE)
        );
      }

      const shoeSnapshot = await getDocs(shoesQuery);
      const shoeList = shoeSnapshot.docs.map((doc) => ({
        id: doc.id,
        code: doc.id, // Shoe code is the document ID
        name: doc.data().shoeName,
        price: doc.data().shoePrice,
        size: doc.data().shoeSize,
        imageUrl: doc.data().ImageUrl,
        // Add other fields to pass to ShoeDetailScreen
        addedBranch: doc.data().addedBranch,
        addedUserID: doc.data().addedUserID,
        isSold: doc.data().isSold,
        buyerPhoneNumber: doc.data().buyerPhoneNumber,
        soldDate: doc.data().soldDate,
        soldBranch: doc.data().soldBranch,
        soldPrice: doc.data().soldPrice,
        transactionMethod: doc.data().transactionMethod,
      }));

      if (reset || search) {
        setShoes(shoeList);
        setFilteredShoes(shoeList); // Set both shoes and filteredShoes when resetting or searching
      } else {
        setShoes((prevShoes) => [...prevShoes, ...shoeList]);
        setFilteredShoes((prevShoes) => [...prevShoes, ...shoeList]); // Update filteredShoes too
      }

      const lastVisibleDoc = shoeSnapshot.docs[shoeSnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      if (shoeList.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching shoes: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Fetch shoes based on search query
    fetchShoes(true, true); // Reset and search
  };

  const handleNextPage = () => {
    if (hasMore) fetchShoes();
  };

  const handleShoePress = (shoe) => {
    // Pass the shoe object to the ShoeDetailScreen
    navigation.navigate("ShoeDetailScreen", { shoe });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Барааны нэрээр хайх"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.shoeContainer}>
        {filteredShoes.map((shoe) => (
          <View key={shoe.id} style={styles.shoeWrapper}>
            <ShoeButton
              imageUrl={shoe.imageUrl}
              code={shoe.code}
              name={shoe.name}
              price={shoe.price}
              size={shoe.size}
              addedBranch={shoe.addedBranch}
              addedUserID={shoe.addedUserID}
              soldBranch={shoe.soldBranch}
              isSold={shoe.isSold}
              buyerPhoneNumber={shoe.buyerPhoneNumber}
              soldDate={shoe.soldDate}
              soldPrice={shoe.soldPrice}
              transactionMethod={shoe.transactionMethod}
              onPress={() => handleShoePress(shoe)} // Handle press and navigate
            />
          </View>
        ))}
      </ScrollView>
      {hasMore && (
        <View style={styles.paginationContainer}>
          <Button
            title="Илүү ихийг ачаалах"
            onPress={handleNextPage}
            disabled={loading}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 12,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 20,
    paddingRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  shoeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  shoeWrapper: {
    width: "45%", // Two items per row
  },
  paginationContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
});

export default ShoeInventoryScreen;
