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
      'https://get.pxhere.com/photo/nature-cloud-sky-rain-view-atmosphere-dark-weather-storm-cumulus-thunder-clouds-thunderstorm-the-background-phenomenon-dark-clouds-after-the-storm-meteorological-phenomenon-1103365.jpg',
    дождь:
      'https://get.pxhere.com/photo/cloud-sky-sunlight-rain-atmosphere-weather-storm-drip-window-pane-rainy-clouds-gloomy-meteorological-phenomenon-rained-out-regentrop-atmospheric-phenomenon-atmosphere-of-earth-702768.jpg',
    гроза:
      'https://pibig.info/uploads/posts/2022-12/1670009679_5-pibig-info-p-grozovoe-nebo-oboi-oboi-6.jpg',
    облачно:
      'https://furman.top/uploads/posts/2023-05/1683219757_furman-top-p-goluboe-nebo-s-oblakami-fon-krasivo-44.jpg',
    облачноСпрояснением:
      'https://furman.top/uploads/posts/2023-05/1683219697_furman-top-p-goluboe-nebo-s-oblakami-fon-krasivo-37.jpg',
    чистоеНебо:
      'https://amiel.club/uploads/posts/2022-03/1647578862_1-amiel-club-p-chistoe-nebo-kartinki-1.jpg',
    ночноеНебоЧистое:
      'https://i.pinimg.com/originals/e9/21/25/e9212565ed3cdcb1d321bab6721db7f8.png',
    ночноеНебоСОблаками:
      'https://i3.wp.com/catherineasquithgallery.com/uploads/posts/2021-02/1614454249_4-p-fon-temnoe-nebo-4.jpg?ssl=1',
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
          uri: weatherImage.ночноеНебоЧистое,
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
