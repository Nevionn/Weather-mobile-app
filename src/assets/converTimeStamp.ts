export const convertTimeStamp = (time: number, timezoneOffset: number) => {
  const date = new Date((time + timezoneOffset) * 1000); // Учитываем смещение UTC

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'UTC', // Используем UTC, так как offset уже применён
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat('ru-RU', options).format(date);
};
