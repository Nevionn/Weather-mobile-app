interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  weather: {
    description: string;
    id: number;
  }[];
  sys: {
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number;
}

export default WeatherData;
