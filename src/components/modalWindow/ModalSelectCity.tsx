import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import {COLOR} from '../../assets/colorTheme';
import ModalAddCityProps from '../../types/ModalAddCityProps';
import cityData from '../../assets/city.json';

const ModalSelectCity: React.FC<ModalAddCityProps> = ({
  isVisible,
  onClose,
  onCitySelect,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  const cities = cityData
    .map(city => city.city)
    .filter((name): name is string => typeof name === 'string');

  useEffect(() => {
    setFilteredCities(cities);
  }, [isVisible]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    setFilteredCities(
      cities.filter(city => city.toLowerCase().includes(text.toLowerCase())),
    );
  };

  const handleCitySelect = (city: string) => {
    const trimmedCity = city.trim();
    onCitySelect(trimmedCity);
    setSearchText('');
    setFilteredCities(cities);
    onClose();
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}>
        <View style={styles.modalBackground}>
          <View
            style={{
              ...styles.modalView,
              backgroundColor: COLOR.SECONDARY_COLOR,
            }}>
            <Text style={styles.textHead}>Выберите город</Text>
            <TextInput
              style={styles.input}
              placeholder="Введите название города"
              placeholderTextColor="#ccc"
              value={searchText}
              onChangeText={handleSearch}
            />
            <FlatList
              data={filteredCities}
              keyExtractor={(item, index) => `${item}_${index}`}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.cityItem}
                  onPress={() => handleCitySelect(item)}>
                  <Text style={styles.cityText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.itemForButtons}>
              <TouchableOpacity
                style={{
                  ...styles.openButton,
                  backgroundColor: COLOR.BUTTON_COLOR,
                }}
                onPress={() => handleCitySelect(searchText)}>
                <Text style={styles.textButton}>Принять</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.openButton,
                  backgroundColor: COLOR.BUTTON_COLOR,
                }}
                onPress={onClose}>
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
  },
  textButton: {
    color: 'white',
    textAlign: 'center',
  },
  textHead: {
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
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
  cityItem: {
    padding: 10,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'transparent',
  },
  cityText: {
    color: 'white',
  },
});

export default ModalSelectCity;
