import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  FlatList,
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
import ShoeButton from "../../components/ShoeButton";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const ITEMS_PER_PAGE = 10; // Number of shoes to load per page

const ShoeInventoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [shoes, setShoes] = useState([]);
  const [lastVisible, setLastVisible] = useState(null); // Store the last visible document
  const [loading, setLoading] = useState(false); // Тэмдэглэх нь ачаалж байгаа эсэхийг харуулна
  const [hasMore, setHasMore] = useState(true); // To check if more data is available
  const [searching, setSearching] = useState(false); // Хайлт хийж байгаа төлөв

  const db = getFirestore();
  const navigation = useNavigation(); // Access navigation

  useEffect(() => {
    fetchShoes(); // Load initial shoes when the component mounts
  }, []);

  const fetchShoes = async (reset = false, search = false) => {
    setLoading(true);
    setSearching(search); // Хайлт хийж байгааг тэмдэглэх

    try {
      const shoesCollection = collection(db, "shoes");
      let shoesQuery;

      if (search && searchQuery) {
        // Хэрэв хайлтаар бол shoeCode-оор шүүх
        shoesQuery = query(
          shoesCollection,
          where("shoeCode", ">=", searchQuery),
          where("shoeCode", "<=", searchQuery + "\uf8ff"),
          limit(ITEMS_PER_PAGE)
        );
      } else {
        // Эхний бүх гутлуудыг татах (эсвэл load more үед)
        shoesQuery = query(
          shoesCollection,
          orderBy("shoeCode"), // shoeCode-г ашиглаж эрэмбэлэх
          lastVisible ? startAfter(lastVisible) : limit(ITEMS_PER_PAGE)
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
      } else {
        setShoes((prevShoes) => [...prevShoes, ...shoeList]);
      }

      const lastVisibleDoc = shoeSnapshot.docs[shoeSnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      if (shoeList.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      setSearching(false); // Хайлт дууссан үед төлвийг false болгоно
    } catch (error) {
      console.error("Error fetching shoes: ", error);
    } finally {
      setLoading(false); // Ачаалалт дууссан
    }
  };

  const handleSearch = () => {
    // Fetch shoes based on search query
    fetchShoes(true, true); // Reset and search
  };

  const handleNextPage = () => {
    if (hasMore && !loading) {
      fetchShoes();
    }
  };

  const handleShoePress = (shoe) => {
    // Pass the shoe object to the ShoeDetailScreen
    navigation.navigate("AdminShoeDetailScreen", { shoe });
  };

  const renderShoe = ({ item }) => (
    <View style={styles.shoeWrapper}>
      <ShoeButton
        imageUrl={item.imageUrl}
        code={item.code}
        name={item.name}
        price={item.price}
        size={item.size}
        addedBranch={item.addedBranch}
        addedUserID={item.addedUserID}
        soldBranch={item.soldBranch}
        isSold={item.isSold}
        buyerPhoneNumber={item.buyerPhoneNumber}
        soldDate={item.soldDate}
        soldPrice={item.soldPrice}
        transactionMethod={item.transactionMethod}
        onPress={() => handleShoePress(item)} // Handle press and navigate
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Гутлын кодоор хайх"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Хайлт хийж байгаа үед ачаалж байгааг харуулах */}
      {loading && !shoes.length && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Ачааллаж байна...</Text>
        </View>
      )}

      {/* Илэрц олдоогүй үед харуулах мессеж */}
      {!loading && !shoes.length && searching && (
        <View style={styles.noResultsContainer}>
          <Text>Илэрц олдсонгүй</Text>
        </View>
      )}

      <FlatList
        data={shoes}
        renderItem={renderShoe}
        keyExtractor={(item) => item.id}
        numColumns={2} // Two items per row
        onEndReached={handleNextPage} // Infinite scroll logic
        onEndReachedThreshold={0.5} // Trigger when 50% of the list is reached
        ListFooterComponent={
          hasMore && !loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : null
        }
      />
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
  shoeWrapper: {
    width: "45%", // Two items per row
    margin: 10,
  },
  loadingContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  noResultsContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});

export default ShoeInventoryScreen;
