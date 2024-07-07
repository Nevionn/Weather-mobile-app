import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NaviBar from '../components/Navibar';
import WeatherData from '../types/WeatherData';
import {WindDirection} from '../assets/windDirection';
import {getIconWeatherBg} from '../assets/fonWeatherBg';
import {weatherImage} from '../assets/objectWeatherImage';

const MainPage = () => {
  const API_KEY: string = '61ba104eaa864aa62a033f6643305b6c';
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null,
  );
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [city, setCity] = useState<string>('');

  const url: string = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${API_KEY}`;

  const handleCitySelect = (_city: string) => {
    setCity(_city);
  };

  const getWeather = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429) {
          setErrorStatus('Превышено число запросов\nпопробуйте позже');
        } else {
          throw new Error(`bad status: ${response.status} - ${errorText}`);
        }
      } else {
        const data: WeatherData = await response.json();

        setCurrentWeather(data);
        setErrorStatus(null);
      }
    } catch (error) {
      console.error('Ошибка при получении данных о погоде:', error);
      setErrorStatus('Ошибка при получении данных о погоде');
    }
  };

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

  // useEffect(() => {
  //   if (!city) return;

  //   const fetchData = async () => {
  //     await getWeather();
  //   };

  //   fetchData();

  //   const intervalId = setInterval(fetchData, 600000); // Обновлять данные каждые 10 минут

  //   return () => clearInterval(intervalId);
  // }, [city]);

  return (
    <View style={styles.container}>
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
      <NaviBar onCitySelect={handleCitySelect} />
      <View style={styles.mainWeatherInfoItem}>
        <Text style={styles.tempText}>
          {currentWeather?.main.temp !== undefined
            ? `${Math.round(currentWeather.main.temp)}°C`
            : '30°C'}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#C2D9F5',
  },
  mainWeatherInfoItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'absolute',
    top: 100,
    height: 200,
    width: '100%',
    backgroundColor: 'transparent',
  },
  gridContainer: {
    height: 340,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '40%',
    backgroundColor: 'transparent',
  },
  paramsGrid: {
    flexDirection: 'column',
  },
  itemGrid: {
    height: 95,
    width: 170,
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
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});

export default MainPage;
