import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, FlatList} from 'react-native';
import {loadFavoriteCities, uploadFavoriteCities} from '../../../../app/storageUtils';
import {COLOR, FONT} from '../../../../app/colorTheme';
import ModalAddCityProps from './ModalAddCityProps';
import cityData from '../../../../entities/city/model/city.json';
import SvgFavorites from '../../../ui/icons/SvgFavorites';
import SvgNotMarkFavorites from '../../../ui/icons/SvgNotMarkFavorites';

const ModalSelectCity: React.FC<ModalAddCityProps> = ({isVisible, onClose, onCitySelect}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [favoriteCities, setFavoriteCities] = useState<string[]>([]);

  const cities = cityData
    .map(city => city.city)
    .filter((name): name is string => typeof name === 'string');

  useEffect(() => {
    // Загружаем избранные города при монтировании
    const fetchFavoriteCities = async () => {
      const favoriteCities = await loadFavoriteCities();
      if (favoriteCities) {
        setFavoriteCities(favoriteCities);
      }
    };

    if (isVisible) {
      fetchFavoriteCities();
    }
  }, [isVisible]);

  // Обновляем `filteredCities` при изменении `searchText` или `favoriteCities`
  useEffect(() => {
    updateFilteredCities(searchText);
  }, [isVisible, favoriteCities]);

  const updateFilteredCities = (text: string) => {
    setSearchText(text);

    const searchResult = cities.filter(city => city.toLowerCase().includes(text.toLowerCase()));

    // Разделение на избранные и обычные
    const sortedCities = [
      ...favoriteCities.filter(city => searchResult.includes(city)),
      ...searchResult.filter(city => !favoriteCities.includes(city)),
    ];
    setFilteredCities(sortedCities);
  };

  const handleSearch = (text: string) => {
    updateFilteredCities(text);
  };

  const handleCitySelect = (city: string) => {
    onCitySelect(city.trim());
    setSearchText('');
    updateFilteredCities('');
    onClose();
  };

  // Переключение избранного города и сохранение в AsyncStorage
  const toggleFavorite = async (city: string) => {
    const updatedFavorites = favoriteCities.includes(city)
      ? favoriteCities.filter(c => c !== city)
      : [...favoriteCities, city];

    setFavoriteCities(updatedFavorites);

    await uploadFavoriteCities(updatedFavorites);
  };

  const renderItem = useCallback(
    ({item}: {item: string}) => {
      return (
        <>
          <TouchableOpacity style={styles.buttonCity} onPress={() => handleCitySelect(item)}>
            <Text style={styles.cityText}>{item}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.buttomFavorites}>
              {favoriteCities.includes(item) ? <SvgFavorites /> : <SvgNotMarkFavorites />}
            </TouchableOpacity>
          </TouchableOpacity>
        </>
      );
    },
    [favoriteCities],
  );

  return (
    <View style={styles.container}>
      <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}>
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.textHead}>Выберите город</Text>
            <TextInput
              style={styles.input}
              placeholder="Введите название города"
              placeholderTextColor="#ccc"
              value={searchText}
              onChangeText={handleSearch}
            />
            <FlatList<string>
              data={filteredCities}
              keyExtractor={(item, index) => `${item}_${index}`}
              renderItem={renderItem}
              getItemLayout={(data, index) => ({
                length: 50,
                offset: 50 * index,
                index,
              })}
              windowSize={5}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
            />
            <View style={styles.itemForButtons}>
              <TouchableOpacity
                style={styles.openButton}
                onPress={() => handleCitySelect(searchText)}>
                <Text style={styles.textButton}>Принять</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.openButton} onPress={onClose}>
                <Text style={styles.textButton}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    height: '70%',
    width: '80%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.SECONDARY_COLOR,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
  },
  itemForButtons: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  openButton: {
    borderRadius: 20,
    padding: 11,
    width: '35%',
    elevation: 2,
    marginTop: 20,
    marginHorizontal: 10,
    backgroundColor: COLOR.BUTTON_COLOR,
  },
  textButton: {
    color: 'white',
    textAlign: 'center',
    fontSize: FONT.SIZE.defaultText,
  },
  textHead: {
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: FONT.SIZE.headerText,
  },
  cityText: {
    color: 'white',
    fontSize: FONT.SIZE.defaultText,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
    color: 'white',
    width: '100%',
  },
  buttonCity: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttomFavorites: {
    padding: 10,
  },
});

export default ModalSelectCity;
