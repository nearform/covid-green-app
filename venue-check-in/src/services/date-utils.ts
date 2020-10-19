import addHours from 'date-fns/addHours';
import addDays from 'date-fns/addDays';
import formatISO from 'date-fns/formatISO';
import parseISO from 'date-fns/parseISO';

export const roundUpToNearestQuarter = () => {
  let now = new Date();
  const minutes = now.getMinutes();

  if (minutes >= 0 && minutes < 15) {
    now.setMinutes(15);
  } else if (minutes >= 15 && minutes < 30) {
    now.setMinutes(30);
  } else if (minutes >= 30 && minutes < 45) {
    now.setMinutes(45);
  } else if (minutes >= 45 && minutes < 60) {
    now.setMinutes(0);
    now = addHours(now, 1);
  }
  return now;
};

export const roundDownToNearestQuarter = () => {
  let now = new Date();
  const minutes = now.getMinutes();

  if (minutes >= 0 && minutes < 15) {
    now.setMinutes(0);
  } else if (minutes >= 15 && minutes < 30) {
    now.setMinutes(15);
  } else if (minutes >= 30 && minutes < 45) {
    now.setMinutes(30);
  } else if (minutes >= 45 && minutes < 60) {
    now.setMinutes(45);
  }
  return now;
};

export const getNextMidnight = () => {
  let now = new Date();

  now = addDays(now, 1);
  now.setMilliseconds(0);
  now.setSeconds(0);
  now.setMinutes(0);
  now.setHours(0);

  return now;
};

export const dateToString = (date: Date): string => formatISO(date);
export const stringToDate = (dateString: string): Date => parseISO(dateString);
