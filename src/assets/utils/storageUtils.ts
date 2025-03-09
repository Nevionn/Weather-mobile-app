import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCity = async () => {
  try {
    const savedCity = await AsyncStorage.getItem('city');
    return savedCity || null;
  } catch (error) {
    console.error('Ошибка при загрузке city из хранилища:', error);
    return null;
  }
};

export const saveCity = async (city: string) => {
  try {
    await AsyncStorage.setItem('city', city);
  } catch (error) {
    console.error('Ошибка при сохранении city в хранилище:', error);
  }
};
