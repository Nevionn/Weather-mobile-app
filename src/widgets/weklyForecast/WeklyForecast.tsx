import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {COLOR, FONT} from '../../app/colorTheme';
import {getDayLabel} from '../../features/weekleForecast/weekleForecast';
import {DailyForecast} from '../../features/weekleForecast/weekleForecast';
import WeklyForecastProps from './WeklyForecastProps';

const WeklyForecast: React.FC<WeklyForecastProps> = ({forecast}) => {
  const renderItemWeeklyDay = ({item, index}: {item: [string, DailyForecast]; index: number}) => {
    const [date, data] = item;
    const dayLabel = getDayLabel(date, index);

    return (
      <View style={styles.weeklyForecastItem}>
        <View style={styles.weeklyForecastTextGuidingItem}>
          <Text style={styles.weeklyForecastDayLabel}>{dayLabel}</Text>
          <View style={styles.separatorWidth} />
          <Text style={styles.weeklyForecastDescription}>{data.description}</Text>
        </View>
        <View>
          <Text style={styles.weeklyForecastTemp}>
            {Math.round(data.temp_max)}° / {Math.round(data.temp_min)}°
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.weeklyForecastContainer}>
      <Text style={styles.weeklyForecastHeader}>Прогноз на 6 дней</Text>
      {forecast ? (
        <FlatList
          data={forecast ? Object.entries(forecast) : []}
          keyExtractor={([date]) => date}
          renderItem={renderItemWeeklyDay}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        />
      ) : (
        <View style={styles.weeklyForecastContainerPlug}>
          <Text style={styles.textIndicator}>Нет данных о прогнозе</Text>
        </View>
      )}
    </View>
  );
};

export default WeklyForecast;

const styles = StyleSheet.create({
  weeklyForecastContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 4,
    backgroundColor: COLOR.RGBA.dark,
    borderRadius: 10,
  },
  weeklyForecastContainerPlug: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 200,
    bottom: 4,
    backgroundColor: COLOR.RGBA.dark,
    borderRadius: 10,
  },
  weeklyForecastItem: {
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  weeklyForecastTextGuidingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  weeklyForecastHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    marginLeft: 2,
  },
  weeklyForecastDayLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  weeklyForecastDescription: {
    fontSize: 14,
    color: 'white',
    textShadowColor: 'rgba(132, 126, 126, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
  },
  weeklyForecastTemp: {
    fontSize: 14,
    color: 'white',
  },
  separatorWidth: {
    width: 14,
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
