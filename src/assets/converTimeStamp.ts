export const convertTimeStamp = (time: number) => {
  const date = new Date(time * 1000);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
  };

  const formatter = new Intl.DateTimeFormat('ru-RU', options);
  const timeString = formatter.format(date);

  return timeString;
};
