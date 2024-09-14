import AsyncStorage from "@react-native-async-storage/async-storage";

// Хэрэглэгчийн статусыг хадгалах
export const storeUser = async (user) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (e) {
    console.error("Хэрэглэгчийн мэдээллийг хадгалах үед алдаа гарлаа", e);
  }
};

// Хэрэглэгчийн статусыг унших
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error("Хэрэглэгчийн мэдээллийг унших үед алдаа гарлаа", e);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem("user");
  } catch (e) {
    console.error("Хэрэглэгчийн мэдээллийг устгах үед алдаа гарлаа", e);
  }
};
