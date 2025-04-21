import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLOR, FONT} from '../../app/colorTheme';
import mainTemperatureProps from './MainTemperatureProps';

const MainTemperature: React.FC<mainTemperatureProps> = ({currentWeather, city, errorStatus}) => {
  return (
    <View style={styles.mainWeatherInfoItem}>
      <Text
        style={currentWeather?.main?.temp !== undefined ? styles.tempText : styles.textIndicator}>
        {city === null
          ? 'Выберите город'
          : currentWeather?.main?.temp !== undefined
          ? `${Math.round(currentWeather.main.temp)}°C`
          : 'Загрузка'}
      </Text>
      <Text style={styles.textIndicator}>{currentWeather?.weather[0].description}</Text>
      <Text style={styles.textError}>{errorStatus}</Text>
    </View>
  );
};

export default MainTemperature;

const styles = StyleSheet.create({
  mainWeatherInfoItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: 140,
    width: '100%',
    marginBottom: '50%',
    backgroundColor: 'green',
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
  tempText: {
    color: 'white',
    fontSize: FONT.SIZE.hugeText,
  },
  textError: {
    color: COLOR.ALERT_COLOR,
    fontSize: FONT.SIZE.errorText,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
