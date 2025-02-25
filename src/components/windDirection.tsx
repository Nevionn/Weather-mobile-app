import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLOR} from '../assets/colorTheme';

export const getWindDirection = (degree: number) => {
  if (degree >= 337.5 || degree < 22.5) {
    return 'Северный';
  } else if (degree >= 22.5 && degree < 67.5) {
    return 'Северо\nвосточный';
  } else if (degree >= 67.5 && degree < 112.5) {
    return 'Восточный';
  } else if (degree >= 112.5 && degree < 157.5) {
    return 'Юго\nвосточный';
  } else if (degree >= 157.5 && degree < 202.5) {
    return 'Южный';
  } else if (degree >= 202.5 && degree < 247.5) {
    return 'Юго\nзападный';
  } else if (degree >= 247.5 && degree < 292.5) {
    return 'Западный';
  } else if (degree >= 292.5 && degree < 337.5) {
    return 'Северо\nзападный';
  }
  return 'Неизвестный';
};

export const WindDirection = ({
  degree,
  speed,
}: {
  degree: number;
  speed: number;
}) => {
  if (degree === undefined || speed === undefined) {
    return null;
  }

  return (
    <View style={styles.compassContainer}>
      <View style={styles.compass}>
        <View
          style={[
            styles.arrow,
            {transform: [{rotate: `${(degree + 180) % 360}deg`}]},
          ]}
        />
        <View style={styles.directionContainer}>
          <View style={{position: 'absolute', top: 0}}>
            <Text style={styles.textDirectionCompas}>С</Text>
          </View>
          <View style={{position: 'absolute', bottom: 0}}>
            <Text style={styles.textDirectionCompas}>Ю</Text>
          </View>
          <View style={{position: 'absolute', right: 0, marginTop: 36}}>
            <Text style={styles.textDirectionCompas}>В</Text>
          </View>
          <View style={{position: 'absolute', left: 0, marginTop: 36}}>
            <Text style={styles.textDirectionCompas}>З</Text>
          </View>
        </View>
      </View>
      <Text style={styles.text}>
        {getWindDirection(degree)}
        {'\n'}
        {speed} м/с
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  compassContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    borderRadius: 10,
    backgroundColor: COLOR.RGBA.dark,
  },
  compass: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderLeftColor: 'transparent',
    borderRightWidth: 5,
    borderRightColor: 'transparent',
    borderBottomWidth: 20,
    borderBottomColor: 'red',
  },
  directionContainer: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 2,
    right: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  textDirectionCompas: {
    color: 'white',
  },
});
