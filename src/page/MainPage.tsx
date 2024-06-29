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

const MainPage = () => {
  const API_KEY: string = '61ba104eaa864aa62a033f6643305b6c';
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null,
  );
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const city: string = 'Moscow';
  const url: string = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${API_KEY}`;

  const weatherImage = {
    пасмурно:
      'https://kartin.papik.pro/uploads/posts/2023-07/1689140502_kartin-papik-pro-p-kartinki-oblachnaya-pogoda-67.jpg',
    гроза:
      'https://pibig.info/uploads/posts/2022-12/1670009679_5-pibig-info-p-grozovoe-nebo-oboi-oboi-6.jpg',
    облачно:
      'https://furman.top/uploads/posts/2023-05/1683219757_furman-top-p-goluboe-nebo-s-oblakami-fon-krasivo-44.jpg',
    облачноСпрояснением:
      'https://i.pinimg.com/originals/88/08/00/880800d545d33679a14919db3f7934a8.png',
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
        console.log(data);
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
        source={{
          uri: weatherImage.гроза,
        }}
        style={styles.backgroundImage}></ImageBackground>
      <NaviBar nameCity={currentWeather?.name ?? 'Загрузка...'} />
      <View style={styles.mainWeatherInfoItem}>
        <Text style={styles.tempText}>
          {currentWeather?.main.temp !== undefined
            ? Math.round(currentWeather.main.temp)
            : ''}
          29°C
        </Text>
        <Text style={styles.text}>
          {/* {currentWeather?.weather[0].description} */}
          {'облачно с прояснениями'}
        </Text>
        <Text style={styles.text}>{errorStatus}</Text>
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
  tempText: {
    color: 'white',
    fontSize: 60,
  },
  text: {
    color: 'white',
    fontSize: 22,
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});

export default MainPage;
