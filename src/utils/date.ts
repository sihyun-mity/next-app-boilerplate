import { isDate } from 'date-fns';

/**
 * 초(ex. 600)를 받아서 분 단위 문자열(ex. '10:00')로 변환
 */
export const secondsToMinutes = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes}:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;
};

/**
 * 남은 시간 계산, 0초 이하일 경우 0으로 표시
 * @param start 남은 시간의 기준 날짜
 * @param end 남은 시간의 종료 날짜
 */
export const getElapsedTime = (start: number, end: string | Date) => {
  const endDate = isDate(end) ? end : new Date(end);
  const timeDiff = endDate.getTime() - start;
  const totalSeconds = Math.max(Math.floor(timeDiff / 1000), 0);
  const days = Math.max(Math.floor(totalSeconds / (60 * 60 * 24)), 0);
  const hours = Math.max(Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60)), 0);
  const minutes = Math.max(Math.floor((totalSeconds % (60 * 60)) / 60), 0);
  const seconds = Math.max(totalSeconds % 60, 0);

  return { days, hours, minutes, seconds };
};
