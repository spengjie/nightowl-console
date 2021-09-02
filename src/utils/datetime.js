import { precedeWidth } from './objectHelper';

export function formatDate(date, format) {
  if (!date) {
    return '';
  }
  if (date.constructor !== Date) {
    date = new Date(date);
  }
  if (date.getTime() === 0) {
    return 'Not Recorded';
  }
  if (arguments.length == 1) {
    format = '%Y-%m-%d %H:%M:%S';
  }
  const map = {
    '%Y' : date.getFullYear(),
    '%m' : precedeWidth(date.getMonth() + 1, 2),
    '%d' : precedeWidth(date.getDate(), 2),
    '%H' : precedeWidth(date.getHours(), 2),
    '%M' : precedeWidth(date.getMinutes(), 2),
    '%S' : precedeWidth(date.getSeconds(), 2),
  };
  let formattedStr = format;
  for (const key in map) {
    formattedStr = formattedStr.replace(key, map[key]);
  }
  return formattedStr;
}

export function getLocalDate(dateString) {
  const date = new Date(dateString);
  date.setTime( date.getTime() + date.getTimezoneOffset() * 60 * 1000 );
  return date;
}

export function getTzoffset() {
  return -(new Date().getTimezoneOffset() / 60);
}
