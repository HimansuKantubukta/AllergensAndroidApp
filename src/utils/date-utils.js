/**
 * Converts string to date.
 * Doesn't care for hours.
 * @param {String} strDate e.g. '2012-04-23T00:00:00.000Z'
 */
export function strToDate(strDate) {
  const year = parseInt(strDate.substring(0, 4), 10);
  const mon = parseInt(strDate.substring(5, 7), 10);
  const date = parseInt(strDate.substring(8, 10), 10);
  const result = new Date();
  result.setFullYear(year, mon - 1, date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function endDate(endDateValue) {
  const year = parseInt(endDateValue.substring(0, 4), 10);
  const mon = parseInt(endDateValue.substring(5, 7), 10);
  const date = parseInt(endDateValue.substring(8, 10), 10);
  const result = new Date();
  result.setFullYear(year, mon - 1, date);
  result.setHours(23, 59, 59, 59);
  return result;
}

/**
 * isKeyDateWithinPeriod:
 * Given two dates represented as strings (e.g. '2012-04-23T00:00:00.000Z')
 * and a Date object representing a key date,
 * will return true/false if the given keyDate lies within the period.
 * It doesn't care for hours only days.
 * @param {Date} todayDate
 * @param {String} startStr e.g. '2012-04-23T00:00:00.000Z'
 * @param {String} endStr e.g. '2012-04-23T00:00:00.000Z'
 */
export function isKeyDateWithinPeriod(keyDate, startStr, endStr) {
  const start = strToDate(startStr);
  const end = endDate(endStr);
  const curr = keyDate.getTime();

  return curr >= start.getTime() && curr <= end.getTime();
}

export function tomorrow00h(today) {
  const midnight = new Date(today);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  return midnight;
}

export function dateYesterday(today) {
  const yesterday = new Date(today)

  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday;
}

export function timefromHours(hours, nowDate) {
  const date = new Date(nowDate);
  const timeMS = date.setHours(hours, 0, 0, 0);

  return timeMS;
}

export function timeMidnight(nowDate) {
  const date = new Date(nowDate);
const timeMS = date.setHours(0, 0, 0, 0);
return timeMS;
}
