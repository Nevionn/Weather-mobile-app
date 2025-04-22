import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLOR, FONT} from '../../app/colorTheme';
import AdditionalDataProps from './AdditionalDataProps';

const AdditionalData: React.FC<AdditionalDataProps> = ({currentWeather}) => {
  return (
    <>
      <View style={styles.itemGrid}>
        <Text style={styles.textIndicator}>
          Ощущается{'\n'}
          {currentWeather?.main.feels_like
            ? Math.round(currentWeather.main.feels_like * 10) / 10
            : ''}
          °C
        </Text>
      </View>
      <View style={styles.itemGrid}>
        <Text style={styles.textIndicator}>
          Облачность{'\n'}
          {currentWeather?.clouds.all}%
        </Text>
      </View>
      <View style={styles.itemGrid}>
        <Text style={styles.textIndicator}>
          Влажность{'\n'}
          {currentWeather?.main.humidity}%
        </Text>
      </View>
    </>
  );
};

export default AdditionalData;

const styles = StyleSheet.create({
  itemGrid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    backgroundColor: COLOR.RGBA.dark,
  },
  textIndicator: {
    color: 'white',
    fontSize: FONT.SIZE.indicatorText,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
});
