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
    снег: '',
    туман: '',
    торнадо: '',
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

  const getWindDirection = (degree: number) => {
    if (degree >= 337.5 || degree < 22.5) {
      return 'Северный';
    } else if (degree >= 22.5 && degree < 67.5) {
      return 'Северо-восточный';
    } else if (degree >= 67.5 && degree < 112.5) {
      return 'Восточный';
    } else if (degree >= 112.5 && degree < 157.5) {
      return 'Юго-восточный';
    } else if (degree >= 157.5 && degree < 202.5) {
      return 'Южный';
    } else if (degree >= 202.5 && degree < 247.5) {
      return 'Юго-западный';
    } else if (degree >= 247.5 && degree < 292.5) {
      return 'Западный';
    } else if (degree >= 292.5 && degree < 337.5) {
      return 'Северо-западный';
    }
    return 'Неизвестный';
  };

  const WindDirection = ({degree, speed}: {degree: number; speed: number}) => {
    if (degree === undefined || speed === undefined) {
      return null; // Вернуть null или что-то другое в случае отсутствия данных
    }

    return (
      <View style={styles.compassContainer}>
        <View style={styles.compass}>
          <View
            style={[styles.arrow, {transform: [{rotate: `${degree}deg`}]}]}
          />
          <View style={styles.directionContainer}>
            <View style={{position: 'absolute', top: 0}}>
              <Text style={styles.textDirectionCompas}>С</Text>
            </View>
            <View style={{position: 'absolute', bottom: 0}}>
              <Text style={styles.textDirectionCompas}>Ю</Text>
            </View>
            <View style={{position: 'absolute', right: 0, marginTop: 36}}>
              <Text style={styles.textDirectionCompas}>В</Text>
            </View>
            <View style={{position: 'absolute', left: 0, marginTop: 36}}>
              <Text style={styles.textDirectionCompas}>З</Text>
            </View>
          </View>
        </View>
        <Text style={styles.text}>
          {getWindDirection(degree)}
          {'\n'}
          {speed} м/с
        </Text>
      </View>
    );
  };

  const getIconWeatherBg = (weatherCode: number): string | undefined => {
    if (weatherCode === undefined || weatherCode === null) {
      return undefined;
    }

    let bgImage: string | undefined = '';

    if (weatherCode >= 200 && weatherCode <= 232) bgImage = weatherImage.гроза;
    else if (weatherCode >= 300 && weatherCode <= 321) {
      bgImage = weatherImage.дождь;
    } else if (weatherCode >= 500 && weatherCode <= 531) {
      bgImage = weatherImage.дождь;
    } else if (weatherCode >= 600 && weatherCode <= 622) {
      bgImage = weatherImage.снег;
    } else if (weatherCode >= 701 && weatherCode <= 781) {
      bgImage = weatherImage.туман;
      if (weatherCode === 781) {
        bgImage = weatherImage.торнадо;
      }
    } else if (weatherCode >= 800 && weatherCode <= 804) {
      if (weatherCode === 800) {
        bgImage = weatherImage.чистоеНебо;
      } else if (weatherCode === 801) {
        bgImage = weatherImage.облачноСпрояснением;
      } else if (weatherCode === 802 || weatherCode === 803) {
        bgImage = weatherImage.облачно;
      } else {
        bgImage = weatherImage.пасмурно;
      }
    } else {
      // handle default case if needed
    }

    return bgImage || undefined;
  };

  useEffect(() => {
    const fetchData = async () => {
      await getWeather();
    };

    fetchData();

    const intervalId = setInterval(fetchData, 600000); // Обновлять данные каждые 10 минут

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: currentWeather
            ? getIconWeatherBg(currentWeather.weather[0].id ?? 0) ?? ''
            : '',
        }}
        style={styles.backgroundImage}></ImageBackground>
      <NaviBar nameCity={currentWeather?.name ?? 'Загрузка...'} />
      <View style={styles.mainWeatherInfoItem}>
        <Text style={styles.tempText}>
          {currentWeather?.main.temp !== undefined
            ? `${Math.round(currentWeather.main.temp)}°C`
            : ''}
          {/* 29°C */}
        </Text>
        <Text style={styles.text}>
          {currentWeather?.weather[0].description}
          {/* {'облачно с прояснениями'} */}
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
    backgroundColor: '#C2D9F5',
  },
  compassContainer: {
    height: '90%',
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    borderRadius: 10,
    backgroundColor: '#C2D9F5',
  },
  compass: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderLeftColor: 'transparent',
    borderRightWidth: 5,
    borderRightColor: 'transparent',
    borderBottomWidth: 20,
    borderBottomColor: 'red',
  },
  directionContainer: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 2,
    right: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  directionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  tempText: {
    color: 'white',
    fontSize: 60,
  },
  textDirectionCompas: {
    color: 'white',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});

export default MainPage;
