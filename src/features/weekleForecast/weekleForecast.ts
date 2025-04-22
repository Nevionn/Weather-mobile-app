const API_KEY = '61ba104eaa864aa62a033f6643305b6c';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=ru&appid=';

interface WeatherAPIResponseItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: {description: string}[];
  wind: {
    speed: number;
  };
}

interface WeatherForecastWeeklyData {
  date: string;
  temp_min: number;
  temp_max: number;
  temp: number;
  description: string;
  wind_speed: number;
  humidity: number;
}

export interface DailyForecast {
  temp_sum: number;
  temp_min: number;
  temp_max: number;
  count: number;
  description: string;
  wind_speed: number;
  humidity: number;
}

export const getDayLabel = (dateStr: string, index: number): string => {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  const parts = dateStr.split('.');
  if (parts.length !== 3) return 'Ошибка даты';

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);
  if (isNaN(date.getTime())) return 'Ошибка даты';

  const today = new Date().getDay();
  const dayOfWeek = (today + index) % 7;

  return index === 0 ? 'Сегодня' : days[dayOfWeek];
};

// Функция для получения прогноза погоды
const getForecastData = async (cityName: string): Promise<WeatherForecastWeeklyData[]> => {
  try {
    const url = `${BASE_URL}${API_KEY}&q=${cityName}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.list.map((item: WeatherAPIResponseItem) => ({
      date: new Date(item.dt * 1000).toLocaleString('ru-RU'),
      temp: item.main.temp,
      temp_min: item.main.temp_min,
      temp_max: item.main.temp_max,
      description: item.weather[0].description,
      wind_speed: item.wind.speed,
      humidity: item.main.humidity,
    }));
  } catch (error) {
    console.error('Ошибка получения прогноза:', error);
    return [];
  }
};

// Функция для обработки полученных данных прогноза
const processForecastData = (data: WeatherForecastWeeklyData[]): Record<string, DailyForecast> => {
  const dailyForecast: Record<string, DailyForecast> = {};

  if (data.length === 0) {
    // Заглушка на 6 дней, если данных нет
    const placeholderDates = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    placeholderDates.forEach(date => {
      dailyForecast[date] = {
        temp_sum: 0,
        temp_min: 0,
        temp_max: 0,
        count: 1,
        description: 'Нет данных',
        wind_speed: 0,
        humidity: 0,
      };
    });
    return dailyForecast;
  }

  data.forEach(item => {
    const date = item.date.split(',')[0];

    if (!dailyForecast[date]) {
      dailyForecast[date] = {
        temp_sum: 0,
        temp_min: item.temp_min,
        temp_max: item.temp_max,
        count: 0,
        description: item.description,
        wind_speed: item.wind_speed,
        humidity: item.humidity,
      };
    }

    // Обновляем среднюю температуру, мин/макс значения
    dailyForecast[date].temp_sum += item.temp;
    dailyForecast[date].temp_min = Math.min(dailyForecast[date].temp_min, item.temp_min);
    dailyForecast[date].temp_max = Math.max(dailyForecast[date].temp_max, item.temp_max);
    dailyForecast[date].count += 1;
  });

  return dailyForecast;
};

// Главная функция, которая и получает данные, и обрабатывает их
export const fetchAndProcessForecast = async (
  cityName: string,
): Promise<Record<string, DailyForecast>> => {
  const data = await getForecastData(cityName);
  return processForecastData(data);
};
