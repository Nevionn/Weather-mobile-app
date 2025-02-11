import React, {useState, useEffect, useCallback} from 'react';
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
const {width} = Dimensions.get('window');

const MainPage = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null,
  );
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [city, setCity] = useState<string>('Санкт-петербург');

  const [refreshing, setRefreshing] = useState(false);

  let sr: any = '03:44';
  let ss: any = '22:11';

  if (currentWeather && currentWeather.sys) {
    sr = convertTimeStamp(currentWeather.sys.sunrise);
    ss = convertTimeStamp(currentWeather.sys.sunset);
  }

  const currentTime = new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCitySelect = (_city: string) => {
    setCity(_city);
  };

  const onRefreshApp = useCallback(async () => {
    if (!city) {
      console.error('Город не указан для обновления погоды.');
      return;
    }

    setRefreshing(true);
    try {
      await getWeather({city, setErrorStatus, setCurrentWeather});
    } catch (error) {
      console.error('Ошибка при обновлении:', error);
    } finally {
      setRefreshing(false);
    }
  }, [city]);

  useEffect(() => {
    const loadCity = async () => {
      try {
        const savedCity = await AsyncStorage.getItem('city');
        if (savedCity) {
          setCity(savedCity);
        } else {
          console.log('значение не найдено');
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
        await AsyncStorage.setItem('city', city);
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
        <ImageBackground
          source={
            currentWeather
              ? getIconWeatherBg(
                  currentWeather.weather[0].id ?? '',
                  weatherImage,
                  currentWeather.dt,
                  currentWeather.timezone,
                )
              : weatherImage.облачно
          }
          style={styles.backgroundImage}></ImageBackground>

        <View style={styles.mainWeatherInfoItem}>
          <Text
            style={
              currentWeather?.main?.temp !== undefined
                ? styles.tempText
                : styles.text
            }>
            {currentWeather?.main.temp !== undefined
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
                {currentWeather?.main.feels_like}°C
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
        <DaylightInfo
          sunrise={sr}
          sunset={ss}
          daylightDuration={
            currentWeather?.sys?.sunrise && currentWeather?.sys?.sunset
              ? getDaylightDuration(
                  currentWeather.sys.sunrise,
                  currentWeather.sys.sunset,
                )
              : ''
          }
          currentTime={currentTime}
        />
      </ScrollView>
      <NaviBar onCitySelect={handleCitySelect} />
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
  testBox: {
    height: 200,
    width: 200,
    backgroundColor: 'black',
    marginBottom: 20,
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
    backgroundColor: 'transparent',
  },
  gridContainer: {
    height: 340,
    width: width * 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '4%',
    backgroundColor: 'transparent',
  },
  paramsGrid: {
    width: width * 0.45, // Ширина зависит от ширины экрана (примерно 45%)
    flexDirection: 'column',
    margin: 4,
    marginLeft: 6,
    backgroundColor: 'transparent',
  },
  itemGrid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(192,217,245, 0.6)',
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
    color: 'red',
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
