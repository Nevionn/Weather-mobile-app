import WeatherData from '../types/WeatherData';

const API_KEY: string = '61ba104eaa864aa62a033f6643305b6c';

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
    const url: string = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${API_KEY}`;
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
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Проблема с интернет-соединением:', error);
      setErrorStatus('Проблема с интернет-соединением');
    } else {
      console.error('Ошибка при получении данных о погоде:', error);
      setErrorStatus('Ошибка при получении данных о погоде');
    }
  }
};

export default getWeather;
