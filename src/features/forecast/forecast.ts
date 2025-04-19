import WeatherData from '../../shared/globalTypes/WeatherData';

const API_KEY = '61ba104eaa864aa62a033f6643305b6c';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  const url = `${BASE_URL}?q=${city}&units=metric&lang=ru&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
};

const getWeather = async ({
  city,
  setErrorStatus,
  setCurrentWeather,
}: {
  city: string;
  setErrorStatus: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentWeather: React.Dispatch<React.SetStateAction<WeatherData | null>>;
}) => {
  try {
    const data = await fetchWeatherData(city);
    setCurrentWeather(data);
    setErrorStatus(null);
  } catch (error: unknown) {
    console.error('Ошибка при получении данных о погоде:', error);

    if (error instanceof Error) {
      if (error.message.includes('Network request failed')) {
        setErrorStatus('Проблема с интернет-соединением');
      } else if (error.message.includes('HTTP 429')) {
        setErrorStatus('Превышено число запросов\nпопробуйте позже');
      } else {
        setErrorStatus('Ошибка при получении данных о погоде');
      }
    } else {
      setErrorStatus('Неизвестная ошибка');
    }
  }
};

export default getWeather;
