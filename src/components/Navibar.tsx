import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {getCity} from '../assets/utils/storageUtils';
import NaviBarProps from '../types/NaviBarProps';
import SvgSettings from './icons/SvgSettings';
import ModalSettings from './modalWindow/ModalSettings';
import ModalSelectCity from './modalWindow/ModalSelectCity';

const NaviBar: React.FC<NaviBarProps> = ({onCitySelect}) => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [isAddCityModalVisible, setIsAddCityModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');

  const openSettingsMenu = () => {
    setIsSettingsModalVisible(true);
  };

  const closeSettingsMenu = () => {
    setIsSettingsModalVisible(false);
  };

  const openSelectCityModal = () => {
    setIsAddCityModalVisible(true);
  };

  const closeSelectCityModal = () => {
    setIsAddCityModalVisible(false);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    onCitySelect(city); // Передаем выбранный город в MainPage
    closeSelectCityModal();
  };

  useEffect(() => {
    const fetchCity = async () => {
      const storedCity = await getCity();
      if (storedCity) {
        setSelectedCity(storedCity);
      } else {
        console.log('значение city не найдено');
      }
    };

    fetchCity();
  }, []);

  const statusBarHeight: any = StatusBar.currentHeight;

  return (
    <>
      <View style={[styles.navibar, {top: statusBarHeight - 5}]}>
        <TouchableOpacity
          onPress={() => openSelectCityModal()}
          style={styles.touchArea}>
          <Text style={styles.textAddNewCity}>+</Text>
        </TouchableOpacity>
        <Text style={styles.textCity}>{selectedCity}</Text>
        <TouchableOpacity
          onPress={() => openSettingsMenu()}
          style={styles.touchArea}>
          <SvgSettings />
        </TouchableOpacity>
      </View>
      <ModalSettings
        isVisible={isSettingsModalVisible}
        onClose={closeSettingsMenu}
      />
      <ModalSelectCity
        isVisible={isAddCityModalVisible}
        onClose={closeSelectCityModal}
        onCitySelect={handleCitySelect}
      />
    </>
  );
};

const styles = StyleSheet.create({
  navibar: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    width: '100%',
    zIndex: 10,
  },
  textAddNewCity: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  textCity: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    marginLeft: 14,
  },
  touchArea: {
    backgroundColor: 'transparent',
    padding: 8,
  },
});

export default NaviBar;
