import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  ActivityIndicator,
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

const ITEMS_PER_PAGE = 10; // Нэг удаад ачаалах гутлын тоо

const ShoeInventoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [shoes, setShoes] = useState([]);
  const [filteredShoes, setFilteredShoes] = useState([]); // Filtered shoes based on search query
  const [lastVisible, setLastVisible] = useState(null); // Сүүлийн ачааллагдсан бичлэгийг хадгалах
  const [loading, setLoading] = useState(false); // Тэмдэглэх нь ачаалж байгаа эсэхийг харуулна
  const [hasMore, setHasMore] = useState(true); // Цааш ачаалах боломж байгаа эсэхийг шалгах
  const [searching, setSearching] = useState(false); // Хайлт хийж байгаа төлөв

  const db = getFirestore();
  const navigation = useNavigation(); // Access navigation

  useEffect(() => {
    fetchShoes(); // Анхны гутлуудыг ачаалах
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
        setFilteredShoes(shoeList); // Set both shoes and filteredShoes when resetting or searching
      } else {
        setShoes((prevShoes) => [...prevShoes, ...shoeList]);
        setFilteredShoes((prevShoes) => [...prevShoes, ...shoeList]); // Update filteredShoes too
      }

      const lastVisibleDoc = shoeSnapshot.docs[shoeSnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc); // Сүүлийн бичлэгийг хадгалах

      if (shoeList.length < ITEMS_PER_PAGE) {
        setHasMore(false); // Цааш ачаалах боломж байхгүй
      }

      setSearching(false); // Хайлт дууссан үед төлвийг false болгоно
    } catch (error) {
      console.error("Error fetching shoes: ", error);
    } finally {
      setLoading(false); // Ачаалалт дууссан
    }
  };

  const handleSearch = () => {
    // Хайлт хийсний дараа анхны өгөгдлүүдийг ачаалах
    fetchShoes(true, true); // Reset and search
  };

  const handleNextPage = () => {
    if (hasMore && !loading) {
      fetchShoes();
    }
  };

  const handleShoePress = (shoe) => {
    // Гутлын дэлгэрэнгүй дэлгэц рүү шилжих
    navigation.navigate("ShoeDetailScreen", { shoe });
  };

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

      {/* Ачаалж байгаа төлөв */}
      {loading && !shoes.length && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Ачааллаж байна...</Text>
        </View>
      )}

      {/* Илэрц олдоогүй үед харуулах */}
      {!loading && !filteredShoes.length && searching && (
        <View style={styles.noResultsContainer}>
          <Text>Илэрц олдсонгүй</Text>
        </View>
      )}

      {/* Гутлын жагсаалт */}
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

      {/* Илүү их гутал ачаалах товч */}
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
