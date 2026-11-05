import { sortBy } from 'lodash';
import { mergeRepeated } from '../utils/array-utils';
import { isKeyDateWithinPeriod } from '../utils/date-utils';
import { DayPart } from './DayPart';
import { DayPartsSchedule } from './DayPartsSchedule';

export function parseReqDate(reqDateArr) {}

/**
 * A menu plan is an object with an ID and a day parts schedule.
 */
export class MenuPlan {
  static idCounter = 1;

  static getNextId() {
    const id = MenuPlan.idCounter;
    MenuPlan.idCounter += 1;
    return id;
  }

  constructor() {
    this.id = MenuPlan.getNextId(); // Make sure our ID is always unique by default.
  }

  /**
   *
   * @param {Object} serverMenuPlan an object with `id` and `ReqDate`.
   * See `sampleGetOutletMenuPlan-out.json`
   *
   */
  static createFromServerResponse(serverMenuPlan) {
    const mp = new MenuPlan();
    mp.originalId = serverMenuPlan.id;
    mp.description = serverMenuPlan.description;
    mp.valid_from = serverMenuPlan.valid_from; // string e.g. "2021-03-30",
    mp.valid_to = serverMenuPlan.valid_to; // string e.g. "2021-04-05"
    mp.dayPartsSchedule = DayPartsSchedule.createFromReqDateArray(
      serverMenuPlan.ReqDate
    );
    return mp;
  }

  /**
   * Returns a new MenuPlan which is a merge of the items underneath.
   * According to requirements 2.5 document.
   *
   * TODO: Write tests for this function
   *
   * @param {MenuPlan} mp1
   * @param {MenuPlan} mp2
   */
  static merge2MenuPlans(mp1, mp2, date) {
    const newMenuPlan = new MenuPlan();

    // menu plans have day parts. We want to have a single set of day parts from both menu plans.
    let dayParts = [
      ...mp1.dayPartsSchedule.getCurrentDayParts(date),
      ...mp2.dayPartsSchedule.getCurrentDayParts(date)
    ];
    // dayParts array above may have repeated day parts (by dayPartCode)
    // do a stable sort by dayPartCode. Needs to be stable to
    // get the mp1 dayParts before the mp2 dayPart.
    dayParts = sortBy(dayParts, d => d.dayPartCode);
    // merge the day parts left-to-right 2 at a time:
    const comparingDayPartCode = (a, b) => a.dayPartCode === b.dayPartCode;
    dayParts = mergeRepeated(
      dayParts,
      comparingDayPartCode,
      DayPart.merge2DayParts
    );

    newMenuPlan.id = 'MERGED';
    newMenuPlan.description = 'Merged';
    newMenuPlan.dayPartsSchedule = new DayPartsSchedule().setDayPartsValidToday(
      dayParts, date
    );
    // Validity date of a merged menu plan is not well defined.
    // For now we use the date of the first menu plan.
    newMenuPlan.valid_from = mp1.valid_from;
    newMenuPlan.valid_to = mp1.valid_to;
    return newMenuPlan;
  }

  /**
   * isValid: returns true when the menu plan is valid
   * for the given `today` date.
   * @param {Date} _today
   */
  isValid(today) {
    today.setHours(0, 0, 0, 0); // We don't really care for hours.
    return isKeyDateWithinPeriod(today, this.valid_from, this.valid_to);
  }

  /**
   * Returns a flat representation of the menu plan data
   * example:
   * {
   *  id: '1',
   *  description: 'Menu plan 1',
   *  valid_from: '2012-04-23T00:00:00.000Z',
   *   valid_to: '2012-04-23T00:00:00.000Z'
   * }
   */
  flattened() {
    return {
      id: this.id,
      originalId: this.originalId,
      description: this.description,
      valid_from: this.valid_from,
      valid_to: this.valid_to
    };
  }
}
