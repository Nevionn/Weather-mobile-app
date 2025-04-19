import WeatherImages from '../../../globalTypes/WeatherImages';

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

  const getHourMinute = (timeString: string) => {
    const [hour, minute] = timeString.split(':').map(num => parseInt(num, 10));
    return {hour, minute};
  };

  const {hour: currentHour, minute: currentMinute} = getHourMinute(localTime);
  const {hour: sunriseHour, minute: sunriseMinute} = getHourMinute(sr);
  const {hour: sunsetHour, minute: sunsetMinute} = getHourMinute(ss);

  const isNight =
    currentHour < sunriseHour ||
    (currentHour === sunriseHour && currentMinute < sunriseMinute) ||
    currentHour > sunsetHour ||
    (currentHour === sunsetHour && currentMinute >= sunsetMinute);

  let bgImage: string | undefined = '';

  if (weatherCode >= 200 && weatherCode <= 232) {
    bgImage = weatherObj.rain.гроза;
  } else if (weatherCode >= 300 && weatherCode <= 321) {
    bgImage = isNight ? weatherObj.ночноеДождливоеНебо : weatherObj.rain.дождь;
  } else if (weatherCode >= 500 && weatherCode <= 531) {
    bgImage = isNight ? weatherObj.ночноеДождливоеНебо : weatherObj.rain.дождь;
  } else if (weatherCode >= 600 && weatherCode <= 622) {
    bgImage = isNight ? weatherObj.night.ночноеЧистоеНебоЗимой : weatherObj.снег;
  } else if (weatherCode >= 701 && weatherCode <= 781) {
    bgImage = weatherCode === 781 || weatherCode === 771 ? weatherObj.торнадо : weatherObj.туман;
  } else if (weatherCode >= 800 && weatherCode <= 804) {
    if (weatherCode === 800) {
      bgImage = isNight ? weatherObj.night.ночноеНебоЧистое : weatherObj.чистоеНебо;
    } else if (weatherCode === 801 || weatherCode === 803) {
      bgImage = isNight
        ? weatherObj.night.вечернееНебоОблачноСпрояснениями
        : weatherObj.облачноСпрояснением;
    } else if (weatherCode === 802) {
      bgImage = isNight ? weatherObj.night.ночноеНебоСОблаками : weatherObj.облачно;
    } else {
      bgImage = isNight ? weatherObj.пасмурноНочью : weatherObj.rain.пасмурно;
    }
  }

  console.log(`Код погоды: ${weatherCode}`);

  return bgImage || undefined;
};
