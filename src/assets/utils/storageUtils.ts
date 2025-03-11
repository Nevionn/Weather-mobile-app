import AsyncStorage from '@react-native-async-storage/async-storage';

const CITY_STORAGE_KEY = 'city';

export const getCity = async (): Promise<string | null> => {
  try {
    const savedCity = await AsyncStorage.getItem(CITY_STORAGE_KEY);
    return savedCity || null;
  } catch (error) {
    console.error('Ошибка при загрузке city из хранилища:', error);
    return null;
  }
};

export const saveCity = async (city: string) => {
  try {
    await AsyncStorage.setItem(CITY_STORAGE_KEY, city);
  } catch (error) {
    console.error('Ошибка при сохранении city в хранилище:', error);
    return null;
  }
};

const FAVORITE_CITIES_STORAGE_KEY = 'arrayCities';

export const loadFavoriteCities = async (): Promise<string[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITE_CITIES_STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Ошибка загрузки избранных городов', error);
    return [];
  }
};

export const uploadFavoriteCities = async (favoriteCites: string[]) => {
  try {
    await AsyncStorage.setItem(
      FAVORITE_CITIES_STORAGE_KEY,
      JSON.stringify(favoriteCites),
    );
  } catch (error) {
    console.error('Ошибка сохранения избранных городов', error);
  }
};
