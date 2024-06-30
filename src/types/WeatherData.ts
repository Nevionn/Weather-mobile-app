interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
  weather: {
    description: string;
    id: number;
  }[];
}

export default WeatherData;
