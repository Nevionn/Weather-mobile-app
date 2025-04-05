import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  RefreshControl,
  ImageBackground,
  Dimensions,
  LogBox,
} from 'react-native';
const {width} = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import NaviBar from '../components/Navibar';
import WeatherData from '../types/WeatherData';
import {DailyForecast} from '../assets/utils/weekleForecast';
import {WindDirection} from '../components/WindDirection';
import {getIconWeatherBg} from '../assets/fonWeatherBg';
import {weatherImage} from '../assets/objectWeatherImage';
import {convertTimeStamp} from '../assets/converTimeStamp';
import DaylightInfo from '../components/DaylightInfo';
import {getDaylightDuration} from '../assets/dailyLightDuration';
import getWeather from '../assets/utils/forecast';
import {getDayLabel} from '../assets/utils/weekleForecast';
import {fetchAndProcessForecast} from '../assets/utils/weekleForecast';
import {getCity, saveCity} from '../assets/utils/storageUtils';
import {COLOR, FONT} from '../assets/colorTheme';

const MainPage = () => {
  const insets = useSafeAreaInsets();

  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<Record<string, DailyForecast> | null>(null);

  const [sr, setSr] = useState<string | null>(null);
  const [ss, setSs] = useState<string | null>(null);
  const [localTime, setLocalTime] = useState<string | null>(null);

  const [city, setCity] = useState<string | null>(null);

  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
  ]);

  const handleCitySelect = (_city: string) => {
    setCity(_city);
  };

  useEffect(
    function setLocalTimeCity() {
      if (!currentWeather?.sys) return;

      const sunrise = convertTimeStamp(currentWeather.sys.sunrise, currentWeather.timezone);
      const sunset = convertTimeStamp(currentWeather.sys.sunset, currentWeather.timezone);

      const utcTime = currentWeather.dt * 1000;

      // Добавляем смещение временной зоны (в миллисекундах)
      const localTime = new Date(utcTime + currentWeather.timezone * 1000);

      const formattedTime = localTime.toLocaleTimeString('ru-RU', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
      });

      console.log('Обновляем состояния:', sunrise, sunset, formattedTime);

      setSr(sunrise);
      setSs(sunset);
      setLocalTime(formattedTime);
    },
    [currentWeather],
  );

  const fetchForecast = useCallback(async () => {
    if (!city) return;
    await getWeather({city, setErrorStatus, setCurrentWeather});
  }, [city]);

  const fetchWeeklyForecast = useCallback(async () => {
    if (!city) return;
    const weeklyForecast = await fetchAndProcessForecast(city);
    setForecast(weeklyForecast);
  }, [city]);

  useEffect(() => {
    if (!city) return;

    const updateAllForecast = () => {
      fetchForecast();
      fetchWeeklyForecast();
    };

    updateAllForecast();

    // Обновлять данные каждые 10 минут
    const intervalId = setInterval(updateAllForecast, 600000);
    return () => clearInterval(intervalId);
  }, [city, fetchForecast]);

  const onRefreshApp = useCallback(() => {
    if (!city) return;
    setRefreshing(true);
    Promise.all([fetchForecast(), fetchWeeklyForecast()])
      .catch((error: string) => console.error('Ошибка при обновлении:', error))
      .finally(() => setRefreshing(false));
  }, [city, fetchForecast]);

  useEffect(() => {
    const fetchCity = async () => {
      const storedCity = await getCity();
      if (storedCity) {
        setCity(storedCity);
      } else {
        console.log('значение city не найдено');
      }
    };
    fetchCity();
  }, []);

  useEffect(() => {
    const saveCityToStorage = async () => {
      if (city) {
        await saveCity(city);
      }
    };
    saveCityToStorage();
  }, [city]);

  const weatherBg = useMemo(
    function setBackGroundImage() {
      if (!currentWeather) {
        return weatherImage.облачно;
      }

      return getIconWeatherBg(
        currentWeather.weather[0].id ?? '',
        weatherImage,
        localTime ?? '',
        sr ?? '',
        ss ?? '',
      );
    },
    [currentWeather, localTime, sr, ss],
  );

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
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={styles.root}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshApp} />}>
        <NaviBar onCitySelect={handleCitySelect} />
        <ImageBackground source={weatherBg} style={styles.backgroundImage} />

        {/* Блок с основной погодной информацией */}
        <View
          style={[styles.captureMainViewItem, {height: screenHeight + insets.top + insets.bottom}]}>
          {/* Модуль текущей температуры */}
          <View style={styles.positionItemForWeatherInfo}>
            <View style={styles.mainWeatherInfoItem}>
              <Text
                style={
                  currentWeather?.main?.temp !== undefined ? styles.tempText : styles.textIndicator
                }>
                {city === null
                  ? 'Выберите город'
                  : currentWeather?.main.temp !== undefined
                  ? `${Math.round(currentWeather.main.temp)}°C`
                  : 'Загрузка'}
              </Text>
              <Text style={styles.textIndicator}>{currentWeather?.weather[0].description}</Text>
              <Text style={styles.textError}>{errorStatus}</Text>
            </View>
          </View>

          {/* Модуль с прогнозом погоды на 6 дней */}
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
        </View>
        {/* Блок с дополнительными погодными данными*/}
        <View style={styles.gridContainer}>
          <View style={styles.paramsGrid}>
            <WindDirection
              degree={currentWeather?.wind.deg ?? 0}
              speed={currentWeather?.wind.speed ?? 0}
            />
          </View>
          <View style={styles.paramsGrid}>
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
          </View>
        </View>
        {/* Блок с информацией о световом дне*/}
        {currentWeather && sr && ss && localTime ? (
          <DaylightInfo
            sunrise={sr}
            sunset={ss}
            daylightDuration={getDaylightDuration(
              currentWeather.sys.sunrise,
              currentWeather.sys.sunset,
            )}
            currentTime={localTime}
          />
        ) : (
          <View style={styles.daylightInfoPlug}>
            <Text>Загрузка...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureMainViewItem: {
    flex: 1,
    width: '90%',
  },
  positionItemForWeatherInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '50%',
  },
  scrollView: {
    alignItems: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  mainWeatherInfoItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: 140,
    width: '100%',
  },
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
  gridContainer: {
    height: 340,
    width: width * 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  paramsGrid: {
    width: width * 0.45,
    flexDirection: 'column',
    margin: 4,
    marginLeft: 6,
  },
  itemGrid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    backgroundColor: COLOR.RGBA.dark,
  },
  daylightInfoPlug: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 144,
    width: '90%',
    borderRadius: 10,
    backgroundColor: COLOR.RGBA.dark,
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
  textError: {
    color: COLOR.ALERT_COLOR,
    fontSize: FONT.SIZE.errorText,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tempText: {
    color: 'white',
    fontSize: FONT.SIZE.hugeText,
  },
});

export default MainPage;
