import WeatherImages from '../types/WeatherImages';

export const getIconWeatherBg = (
  weatherCode: number,
  weatherObj: WeatherImages,
): string | undefined => {
  if (weatherCode === undefined || weatherCode === null) {
    return undefined;
  }

  const currentHour = new Date().getHours();
  let bgImage: string | undefined = '';

  if (weatherCode >= 200 && weatherCode <= 232) bgImage = weatherObj.rain.гроза;
  else if (weatherCode >= 300 && weatherCode <= 321) {
    if (currentHour >= 23 || currentHour <= 4) {
      bgImage = weatherObj.ночноеДождливоеНебо;
    } else {
      bgImage = weatherObj.rain.дождь;
    }
  } else if (weatherCode >= 500 && weatherCode <= 531) {
    if (currentHour >= 23 || currentHour <= 4) {
      bgImage = weatherObj.ночноеДождливоеНебо;
    } else {
      bgImage = weatherObj.rain.дождь;
    }
  } else if (weatherCode >= 600 && weatherCode <= 622) {
    if (currentHour >= 23 || currentHour <= 4) {
      bgImage = weatherObj.night.ночноеЧистоеНебоЗимой;
    } else {
      bgImage = weatherObj.снег;
    }
  } else if (weatherCode >= 701 && weatherCode <= 781) {
    bgImage = weatherObj.туман;
    if (weatherCode === 781) {
      bgImage = weatherObj.торнадо;
    }
  } else if (weatherCode >= 800 && weatherCode <= 804) {
    if (weatherCode === 800) {
      if (currentHour >= 23 || currentHour <= 4) {
        bgImage = weatherObj.night.ночноеНебоЧистое;
      } else {
        bgImage = weatherObj.чистоеНебо;
      }
    } else if (weatherCode === 801) {
      if (currentHour >= 23 || currentHour <= 4) {
        bgImage = weatherObj.night.ночноеНебоСОблаками;
      } else {
        bgImage = weatherObj.облачноСпрояснением;
      }
    } else if (weatherCode === 802 || weatherCode === 803) {
      if (currentHour >= 23 || currentHour <= 4) {
        bgImage = weatherObj.night.ночноеНебоСОблаками;
      } else {
        bgImage = weatherObj.облачно;
      }
    } else {
      bgImage = weatherObj.rain.пасмурно;
    }
  } else {
    bgImage = '';
  }

  return bgImage || undefined;
};
