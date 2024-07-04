import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Modal} from 'react-native';
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
    closeSelectCityModal(); // Закрываем модальное окно после выбора города
  };

  return (
    <>
      <View style={styles.navibar}>
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
    position: 'absolute',
    top: 0,
    height: 50,
    width: '100%',
    backgroundColor: 'transparent',
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
    padding: 2,
  },
});

export default NaviBar;
