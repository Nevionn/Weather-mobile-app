import WeatherImages from '../types/WeatherImages';

export const getIconWeatherBg = (
  weatherCode: number,
  weatherObj: WeatherImages,
  localTime: string,
  sr: string,
  ss: string,
): string | undefined => {
  if (weatherCode === undefined || weatherCode === null) {
    return undefined;
  }

  const currentHour = parseInt(localTime, 10);
  const sunriseHour = parseInt(sr, 10);
  const sunsetHour = parseInt(ss, 10);

  const isNight = currentHour < sunriseHour || currentHour >= sunsetHour;

  let bgImage: string | undefined = '';

  if (weatherCode >= 200 && weatherCode <= 232) {
    bgImage = weatherObj.rain.гроза;
  } else if (weatherCode >= 300 && weatherCode <= 321) {
    bgImage = isNight ? weatherObj.ночноеДождливоеНебо : weatherObj.rain.дождь;
  } else if (weatherCode >= 500 && weatherCode <= 531) {
    bgImage = isNight ? weatherObj.ночноеДождливоеНебо : weatherObj.rain.дождь;
  } else if (weatherCode >= 600 && weatherCode <= 622) {
    bgImage = isNight
      ? weatherObj.night.ночноеЧистоеНебоЗимой
      : weatherObj.снег;
  } else if (weatherCode >= 701 && weatherCode <= 781) {
    bgImage =
      weatherCode === 781 || weatherCode === 771
        ? weatherObj.торнадо
        : weatherObj.туман;
  } else if (weatherCode >= 800 && weatherCode <= 804) {
    if (weatherCode === 800) {
      bgImage = isNight
        ? weatherObj.night.ночноеНебоЧистое
        : weatherObj.чистоеНебо;
    } else if (weatherCode === 801) {
      bgImage = isNight
        ? weatherObj.night.ночноеНебоСОблаками
        : weatherObj.облачноСпрояснением;
    } else if (weatherCode === 802 || weatherCode === 803) {
      bgImage = isNight
        ? weatherObj.night.ночноеНебоСОблаками
        : weatherObj.облачно;
    } else {
      bgImage = weatherObj.rain.пасмурно;
    }
  }

  return bgImage || undefined;
};
