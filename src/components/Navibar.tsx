import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import NaviBarProps from '../types/NaviBarProps';
import SvgSettings from './icons/SvgSettings';

const NaviBar: React.FC<NaviBarProps> = ({nameCity}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openSettingsMenu = () => {
    setIsModalVisible(true);
  };

  const closeSettingsMenu = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <View style={styles.navibar}>
        <TouchableOpacity style={styles.touchArea}>
          <Text style={styles.textAddNewCity}>+</Text>
        </TouchableOpacity>
        <Text style={styles.textCity}>{nameCity}</Text>
        <TouchableOpacity
          onPress={() => openSettingsMenu()}
          style={styles.touchArea}>
          <SvgSettings />
        </TouchableOpacity>
      </View>
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
