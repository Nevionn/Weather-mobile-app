import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import DaylightInfoProps from '../types/DaylightInfoProps';
import {COLOR, FONT} from '../assets/colorTheme';

const parseTime = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + minutes / 60;
};

const DaylightInfo: React.FC<DaylightInfoProps> = ({
  sunrise,
  sunset,
  daylightDuration,
  currentTime,
}) => {
  const sunriseTime = parseTime(sunrise);
  const sunsetTime = parseTime(sunset);
  const current = parseTime(currentTime);

  const t = (current - sunriseTime) / (sunsetTime - sunriseTime);

  // Ограничение значения t диапазоном от 0 до 1
  const clampedT = Math.max(0, Math.min(1, t));

  const cx = 10 + clampedT * 180;
  const cy = 80 - 70 * Math.sin(Math.PI * clampedT);

  return (
    <View style={styles.container}>
      <Svg height="80" width="200">
        {/* Дуга для светового дня */}
        <Path d="M 10 80 Q 100 10, 190 80" stroke="orange" strokeWidth="2" fill="none" />
        {/* Круг для текущего положения солнца */}
        <Circle cx={cx} cy={cy} r="5" fill="orange" />
      </Svg>
      <View style={styles.infoContainerText}>
        <View style={styles.srItem}>
          <Text style={styles.timeTextSR}>{sunrise}</Text>
        </View>

        <View style={styles.durationDayItem}>
          <Text style={styles.labelText}>Световой день</Text>
        </View>

        <View style={styles.ssItem}>
          <Text style={styles.timeTextSS}>{sunset}</Text>
        </View>
      </View>
      <Text style={styles.durationText}>{daylightDuration}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 144,
    width: '90%',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 5,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: COLOR.RGBA.dark,
  },
  infoContainerText: {
    flexDirection: 'row',
    width: '100%',
  },
  timeTextSR: {
    fontSize: FONT.SIZE.headerText,
    color: 'white',
  },
  timeTextSS: {
    fontSize: FONT.SIZE.headerText,
    color: 'white',
  },
  srItem: {
    position: 'absolute',
    left: 28,
    zIndex: 1,
  },
  ssItem: {
    position: 'absolute',
    right: 25,
  },
  durationDayItem: {
    flex: 1,
    alignItems: 'center',
  },
  timeText: {
    fontSize: FONT.SIZE.headerText,
    color: 'white',
  },
  labelText: {
    fontSize: FONT.SIZE.headerText + 2,
    color: 'white',
  },
  durationText: {
    fontSize: FONT.SIZE.headerText,
    color: 'white',
    marginTop: 4,
  },
});

export default DaylightInfo;
