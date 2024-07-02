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
import NaviBar from '../components/Navibar';
import WeatherData from '../types/WeatherData';
import {WindDirection} from '../assets/windDirection';
import {getIconWeatherBg} from '../assets/fonWeatherBg';

const MainPage = () => {
  const API_KEY: string = '61ba104eaa864aa62a033f6643305b6c';
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null,
  );
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const city: string = 'Москва';
  const url: string = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${API_KEY}`;

  const weatherImage = {
    облачно: require('../image/cloudy-sky.jpg'),
    облачноСпрояснением: require('../image/partly-cloudy.jpg'),
    чистоеНебо: require('../image/clear-sky-v2.jpg'),
    снег: require('../image/winter-sky.jpeg'),
    туман: require('../image/fog-sky.jpg'),
    торнадо: require('../image/tornado-sky.jpg'),
    rain: {
      пасмурно: require('../image/mainly-cloudy.jpg'),
      дождь: require('../image/rainy-sky.jpg'),
      гроза: require('../image/storm-sky.jpg'),
    },
    night: {
      ночноеНебоЧистое: require('../image/night-clear-sky.png'),
      ночноеНебоСОблаками: require('../image/night-cloudy-sky.webp'),
      ночноеЧистоеНебоЗимой: require('../image/winter-night-clear-sky.png'),
    },
    ночноеДождливоеНебо: require('../image/night-rain-sky.jpg'),
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await getWeather();
  //   };

  //   fetchData();

  //   const intervalId = setInterval(fetchData, 600000); // Обновлять данные каждые 10 минут

  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={
          currentWeather
            ? getIconWeatherBg(currentWeather.weather[0].id ?? '', weatherImage)
            : weatherImage.снег
        }
        style={styles.backgroundImage}></ImageBackground>
      <NaviBar nameCity={currentWeather?.name ?? 'Загрузка...'} />
      <View style={styles.mainWeatherInfoItem}>
        <Text style={styles.tempText}>
          {currentWeather?.main.temp !== undefined
            ? `${Math.round(currentWeather.main.temp)}°C`
            : '30°C'}
        </Text>
        <Text style={styles.text}>
          {currentWeather?.weather[0].description}
        </Text>
        <Text style={styles.text}>{errorStatus}</Text>
      </View>
      <View style={styles.gridContainer}>
        <View style={styles.paramsGrid}>
          <View style={styles.compassContainer}>
            <WindDirection
              degree={currentWeather?.wind.deg ?? 0}
              speed={currentWeather?.wind.speed ?? 0}
            />
          </View>
        </View>
        <View style={styles.paramsGrid}>
          <View style={styles.itemGrid}>
            <Text style={styles.text}>
              {' '}
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
// {currentWeather?.wind.speed} WindDirection degree={243} speed={3.44}
// {currentWeather?.main.feels_like} ощущается как 29°C
// {currentWeather?.clouds.all} облачность{'\n'}12%
// {currentWeather?.main.humidity} влажность{'\n'}1%
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
  compassContainer: {
    height: '90%',
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
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
