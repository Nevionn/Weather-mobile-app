import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NaviBarProps from '../types/NaviBarProps';

const NaviBar: React.FC<NaviBarProps> = ({nameCity}) => {
  return (
    <>
      <View style={styles.navibar}>
        <Text style={styles.textCity}>{nameCity}</Text>
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
    backgroundColor: 'transparent',
  },
  textCity: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
});

export default NaviBar;
