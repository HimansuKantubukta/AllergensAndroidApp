import { sortBy } from 'lodash';
import { DayPart } from './DayPart';

/**
 * A DayPartsSchedule contains multiple DayParts but only
 * one of those sets is valid at any one given day.
 * Use getCurrentDayParts to get the current set of DayParts
 */
export class DayPartsSchedule {
  constructor() {
    this.schedule = [];
  }

  static ymdFromString(dateString) {
    return {
      year: parseInt(dateString.substring(0, 4), 10),
      month: parseInt(dateString.substring(5, 7), 10),
      day: parseInt(dateString.substring(8, 10), 10)
    };
  }

  static createFromReqDateArray(reqDateArr) {
    /**
     * Server sends multiple dayPart(s) each tagged with a date
     * We parse those dates.
     *
     * Sample input:
     * [
     * {
     *    "requiredDate": "2020-03-13",
     *    "dayPart": [...]
     * },
     * {
     *    "requiredDate": "2020-03-13",
     *    "dayPart": [...]
     * },
     * ...
     * ]
     * @param {Array} reqDateArr
     * @returns {DayPartSet}
     */
    const dayPartsSchedule = new DayPartsSchedule();
    // parse the dates into day,month,year
    dayPartsSchedule.schedule = reqDateArr.map(d => {
      let dayParts = d.dayPart.map(dp => new DayPart(dp));
      dayParts = sortBy(dayParts, c => c.dayPartCode);
      const r = {
        dayParts,
        ...DayPartsSchedule.ymdFromString(d.requiredDate)
        // year: parseInt(d.requiredDate.substring(0, 4), 10),
        // month: parseInt(d.requiredDate.substring(5, 7), 10),
        // day: parseInt(d.requiredDate.substring(8, 10), 10)
      };
      return r;
    });
    return dayPartsSchedule;
  }

  getCurrentDayParts(date) /* -> [DayPart] */ {
    const futureSchedules = this.getFutureSchedulesSorted(date);
    // ADO-23712
    return this.areRecipesForToday(futureSchedules[0], date)
      ? futureSchedules[0].dayParts
      : []; // it is an Array of DayPart
  }

  // eslint-disable-next-line class-methods-use-this
  areRecipesForToday(dayPart, date) {
    return (
      dayPart?.year === date.getFullYear() &&
      dayPart?.month === date.getMonth() + 1 &&
      dayPart?.day === date.getDate()
    );
  }

  /**
   * discardPastSchedules:
   * Given a list of schedules discards the ones in the past
   * @param {Date} givenToday
   * @param {Array} schedulesArr
   */
  static discardPastSchedules(givenToday, schedulesArr) {
    const today = new Date(givenToday.getTime());
    today.setHours(0, 0, 0, 0);
    const todaysYear = today.getFullYear();
    const todaysMonth = today.getMonth() + 1;
    const todaysDay = today.getDate();

    const futureSchedules = schedulesArr.filter(
      s =>
        s.year > todaysYear ||
        (s.year === todaysYear && s.month > todaysMonth) ||
        (s.year === todaysYear && s.month === todaysMonth && s.day >= todaysDay)
    );

    return futureSchedules;
  }

  /**
   * Returns the schedules which are in the future wrt today
   * and sorted by date ascending (first one is earliest).
   * @param {Date} today
   */
  getFutureSchedulesSorted(today) {
    const schedules = this.schedule || [];
    let futureSchedules = DayPartsSchedule.discardPastSchedules(
      today,
      schedules
    );

    const toDate = (year, month, day, d1) => {
      d1.setHours(0, 0, 0, 0);
      d1.setDate(day);
      d1.setMonth(month - 1);
      d1.setFullYear(year);
      return d1;
    };
    futureSchedules = futureSchedules.sort((s1, s2) => {
      const d1 = toDate(s1.year, s1.month, s1.day, d1);
      const d2 = toDate(s2.year, s2.month, s2.day, d1);
      return d1.getTime() - d2.getTime();
    });

    return futureSchedules;
  }

  setDayPartsValidToday(arrDayParts, today) {
    this.schedule.push({
      dayParts: arrDayParts,
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    });
    return this;
  }
}
