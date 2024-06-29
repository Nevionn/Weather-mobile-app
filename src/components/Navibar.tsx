import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NaviBarProps from '../types/NaviBarProps';

const NaviBar: React.FC<NaviBarProps> = ({nameCity}) => {
  return (
    <>
      <View style={styles.navibar}>
        <Text style={styles.textCity}>{'Москва'}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  navibar: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    height: 50,
    width: '100%',
    backgroundColor: 'grey',
  },
  textCity: {
    color: 'white',
    fontSize: 16,
  },
});

export default NaviBar;
