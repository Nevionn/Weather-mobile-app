import WeatherData from '../../shared/globalTypes/WeatherData';

interface mainTemperatureProps {
  currentWeather: WeatherData | null;
  city: string | null;
  errorStatus: string | null;
}

export default mainTemperatureProps;
