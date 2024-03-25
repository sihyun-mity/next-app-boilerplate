import { TimesEntity } from './elapsed-time.type';

const elapsedTime = (start: Date, end: Date) => {
  const diff = end.getTime() - start.getTime(),
    secondsMillisecond = Math.floor(diff / 1000),
    minutesMillisecond = Math.floor(secondsMillisecond / 60),
    hoursMillisecond = Math.floor(minutesMillisecond / 60),
    days = Math.floor(hoursMillisecond / 24),
    seconds = secondsMillisecond % 60,
    minutes = minutesMillisecond % 60,
    hours = minutes % 24;

  const times: TimesEntity[] = [
    { time: days, unit: '일' },
    { time: hours, unit: '시간' },
    { time: minutes, unit: '분' },
    { time: seconds, unit: '초' },
  ];

  return times
    .filter((e) => e.time > 0)
    .map((v) => `${v.time}${v.unit}`)
    .join(' ');
};

export default elapsedTime;
