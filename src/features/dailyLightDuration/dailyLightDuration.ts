export const getDaylightDuration = (sunrise: number, sunset: number) => {
  const sunriseDate = new Date(sunrise * 1000);
  const sunsetDate = new Date(sunset * 1000);

  // Разница между восходом и закатом солнца в миллисекундах
  const daylightMilliseconds = sunsetDate.getTime() - sunriseDate.getTime();

  // Преобразование разницы в миллисекунды в формат "часы минуты"
  const hours = Math.floor(daylightMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor(
    (daylightMilliseconds % (1000 * 60 * 60)) / (1000 * 60),
  );

  const daylightDuration = `${hours} ч ${minutes} мин`;

  return daylightDuration;
};
