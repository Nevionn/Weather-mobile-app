import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ImageBackground,
  Dimensions,
} from 'react-native';
const {width} = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import NaviBar from '../components/Navibar';
import WeatherData from '../types/WeatherData';
import {WindDirection} from '../components/windDirection';
import {getIconWeatherBg} from '../assets/fonWeatherBg';
import {weatherImage} from '../assets/objectWeatherImage';
import {convertTimeStamp} from '../assets/converTimeStamp';
import DaylightInfo from '../components/DaylightInfo';
import {getDaylightDuration} from '../assets/dailyLightDuration';
import getWeather from '../assets/networkRequest';
import {COLOR} from '../assets/colorTheme';

const MainPage = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null,
  );
  const [sr, setSr] = useState<string | null>(null);
  const [ss, setSs] = useState<string | null>(null);
  const [localTime, setLocalTime] = useState<string | null>(null);

  const [city, setCity] = useState<string | null>(null);

  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(
    function setLocalTimeCity() {
      if (!currentWeather?.sys) return;

      const sunrise = convertTimeStamp(
        currentWeather.sys.sunrise,
        currentWeather.timezone,
      );
      const sunset = convertTimeStamp(
        currentWeather.sys.sunset,
        currentWeather.timezone,
      );

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

  const handleCitySelect = (_city: string) => {
    setCity(_city);
  };

  const onRefreshApp = useCallback(() => {
    if (!city) return;
    setRefreshing(true);
    getWeather({city, setErrorStatus, setCurrentWeather})
      .catch(error => console.error('Ошибка при обновлении:', error))
      .finally(() => setRefreshing(false));
  }, [city]);

  useEffect(() => {
    const loadCity = async () => {
      try {
        const savedCity = await AsyncStorage.getItem('city');
        if (savedCity) {
          setCity(savedCity);
        } else {
          console.log('значение city не найдено');
        }
      } catch (error) {
        console.error('Ошибка при загрузке city из хранилища:', error);
      }
    };

    loadCity();
  }, []);

  useEffect(() => {
    const saveCity = async () => {
      try {
        await AsyncStorage.setItem('city', city ?? '');
      } catch (error) {
        console.error('Ошибка при сохранении city в хранилище:', error);
      }
    };

    if (city) {
      saveCity();
    }
  }, [city]);

  useEffect(() => {
    if (!city) return;

    const fetchData = async () => {
      await getWeather({city, setErrorStatus, setCurrentWeather});
    };

    fetchData();
    const intervalId = setInterval(fetchData, 600000); // Обновлять данные каждые 10 минут

    return () => clearInterval(intervalId);
  }, [city]);

  const weatherBg = useMemo(
    function setBackGroundImage() {
      if (!currentWeather) {
        return weatherImage.night.ночноеНебоЧистое;
      }

      return getIconWeatherBg(
        currentWeather.weather[0].id ?? '',
        weatherImage,
        localTime ?? '',
        sr ?? '',
        ss ?? '',
      );
    },
    [currentWeather],
  );

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ScrollView
        contentContainerStyle={styles.root}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefreshApp} />
        }>
        <NaviBar onCitySelect={handleCitySelect} />
        <ImageBackground source={weatherBg} style={styles.backgroundImage} />
        <View style={styles.mainWeatherInfoItem}>
          <Text
            style={
              currentWeather?.main?.temp !== undefined
                ? styles.tempText
                : styles.text
            }>
            {city === null
              ? 'Выберите город'
              : currentWeather?.main.temp !== undefined
              ? `${Math.round(currentWeather.main.temp)}°C`
              : 'Загрузка'}
          </Text>
          <Text style={styles.text}>
            {currentWeather?.weather[0].description}
          </Text>
          <Text style={styles.textError}>{errorStatus}</Text>
        </View>
        <View style={styles.gridContainer}>
          <View style={styles.paramsGrid}>
            <WindDirection
              degree={currentWeather?.wind.deg ?? 0}
              speed={currentWeather?.wind.speed ?? 0}
            />
          </View>
          <View style={styles.paramsGrid}>
            <View style={styles.itemGrid}>
              <Text style={styles.text}>
                ощущается{'\n'}
                {currentWeather?.main.feels_like
                  ? Math.round(currentWeather.main.feels_like * 10) / 10
                  : ''}
                °C
              </Text>
            </View>
            <View style={styles.itemGrid}>
              <Text style={styles.text}>
                облачность{'\n'}
                {currentWeather?.clouds.all}%
              </Text>
            </View>
            <View style={styles.itemGrid}>
              <Text style={styles.text}>
                влажность{'\n'}
                {currentWeather?.main.humidity}%
              </Text>
            </View>
          </View>
        </View>
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
          <Text>Загрузка...</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
  },
  scrollView: {
    backgroundColor: 'transparent',
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
    marginTop: '25%',
    height: 140,
    width: '100%',
  },
  gridContainer: {
    height: 340,
    width: width * 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '4%',
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
  text: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  textError: {
    color: COLOR.ALERT_COLOR,
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tempText: {
    color: 'white',
    fontSize: 60,
  },
});

export default MainPage;
