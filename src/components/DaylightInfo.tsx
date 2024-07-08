import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Line, Circle, Path} from 'react-native-svg';
import DaylightInfoProps from '../types/DaylightInfoProps';

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
  const cx = 10 + t * 180;
  const cy = 80 - 70 * Math.sin(Math.PI * t);
  return (
    <View style={styles.container}>
      <Svg height="80" width="200">
        {/* Дуга для светового дня */}
        <Path
          d="M 10 80 Q 100 10, 190 80"
          stroke="orange"
          strokeWidth="2"
          fill="none"
        />
        {/* Круг для текущего положения солнца */}
        <Circle cx={cx} cy={cy} r="5" fill="orange" />
      </Svg>
      <View style={styles.infoContainer}>
        <Text style={styles.timeText}>{sunrise}</Text>
        <Text style={styles.labelText}>Световой день</Text>
        <Text style={styles.timeText}>{sunset}</Text>
      </View>
      <Text style={styles.durationText}>{daylightDuration}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 144,
    width: 374,
    alignItems: 'center',
    marginLeft: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(192,217,245, 0.6)',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
  },
  timeText: {
    fontSize: 16,
    color: 'white',
  },
  labelText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  durationText: {
    fontSize: 16,
    color: 'white',
    marginTop: 4,
  },
});

export default DaylightInfo;
