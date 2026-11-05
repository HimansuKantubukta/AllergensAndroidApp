import flatten from 'ramda/src/flatten';
import { groupBy, sortBy } from 'lodash';
import { Course } from './Course';
import { mergeRepeated, removeRepeatsComparingId } from '../utils/array-utils';

/**
 *  {
 *    dayPartCode
 *     course[]
 *       courseCode
 *       item[]
 * }
 * @param {Array} dayPartsArr
 */
export function parseDayPart(serverDayPart) {
  // Each day part has multiple courses, each with multiple items
  // we need to merge the courses into one (we completely ignore it)
  let courses = serverDayPart.course.map(c => new Course(c));
  courses = sortBy(courses, c => c.courseCode);
  return {
    id: serverDayPart.dayPartCode,
    description: serverDayPart.dayPartDesc,
    dayPartCode: serverDayPart.dayPartCode,
    courses
  };
}

/**
 * A DayPart is essencially a group of recipes and a name+id.
 * It has:
 * - id
 * - dayPartCode
 * - items
 * - courses
 * - description
 */
export class DayPart {
  static idCounter = 1;

  static getNextId() {
    const id = DayPart.idCounter;
    DayPart.idCounter += 1;
    return id;
  }

  /**
   * Creates a DayPart.
   *
   * Optional parameter serverDayPart is a json representation
   * of a day part.
   *
   * @param {Array} serverDayPart see above.
   */
  constructor(serverDayPart) {
    this.id = DayPart.getNextId();
    if (serverDayPart) {
      const parsed = parseDayPart(serverDayPart);
      let emptyCourses = 0;
      parsed.courses.map((Course, index) => {
        if (Course.items.length === 0) {
          emptyCourses = emptyCourses + 1;
        }
      });
      if (parsed.courses.length !== emptyCourses) {
        this.originalId = parsed.id;
        this.courses = parsed.courses;
        this.dayPartCode = parsed.dayPartCode;
        this.description = parsed.description;
      } else {
        this.originalId = '';
        this.courses = [];
        this.dayPartCode = '';
        this.description = '';
      }
    }
  }

  /**
   * Returns a flat representation of the DayPart
   * example:
   * {
   *  id: '1',
   *  description: 'Menu plan 1',
   *  menu_plan: '2'
   * }
   * Because we don't know the menu_plan we belong to,
   * this has to be provided as a parameter.
   */
  flattened(menuPlanId) {
    return {
      id: `${menuPlanId}-${this.id}`,
      description: this.description,
      menu_plan: menuPlanId,
      dayPartCode: this.dayPartCode
    };
  }

  flattenedRecipes(menuPlanId) {
    const recipesFromCourses = this.courses.map(c =>
      c.flattenedRecipes(menuPlanId, this.id)
    ); // array of arrays with repeats

    return flatten(recipesFromCourses);
  }

  /**
   * Returns a new DayPart with the same code and description
   * as the first one. The courses being a merge of the courses.
   * @param {DayPart} dp1
   * @param {DayPart} dp2
   */
  static merge2DayParts(dp1, dp2) {
    const newDP = new DayPart();

    newDP.id = `${dp1.id}+${dp2.id}`;
    newDP.dayPartCode = dp1.dayPartCode;
    newDP.description = dp1.description;
    newDP.courses = [...dp1.courses, ...dp2.courses];

    // merge the recipes underneath each repeated course
    newDP.courses = mergeRepeated(
      newDP.courses,
      (a, b) => a.courseCode === b.courseCode,
      Course.merge2Courses
    );

    // make sure each course does not have repeated recipes
    newDP.courses.forEach(c => c.removeRepeatedRecipes());

    return newDP;
  }

  /**
   * Given an array of day parts, all with the same code,creates a new DayPart
   * with the same code and the merge of the courses.
   * The recipes in hte courses are respected as the original dayParts order.
   * Assumed: all dayParts have the same code.
   * Assumed: dayPartsArr is not empty
   *
   * TODO: Unit tests
   *
   * @param {Array} dayPartsArr Array of DayPart
   */
  static mergeDayPartsSameDayPartCode(dayPartsArr) {
    if (dayPartsArr.length === 0) {
      return null;
    }
    const first = dayPartsArr[0];
    const result = new DayPart();
    result.id = `MERGED(${first.dayPartCode})`;
    result.dayPartCode = first.dayPartCode;
    result.description = first.description;
    result.courses = [];
    const courses = flatten(dayPartsArr.map(dp => dp.courses)); // all the couses, possibly repeated courseCodes

    const groupedCourses = groupBy(courses, dp => dp.courseCode); // an object
    // whose keys are the courseCode, value an array of items with that courseCode
    Object.keys(groupedCourses).forEach(courseCode => {
      const mergedCourse = Course.mergeCoursesSameCourseCode(
        groupedCourses[courseCode]
      );
      result.courses.push(mergedCourse);
    });
    result.courses = sortBy(result.courses, c => c.courseCode);

    return result;
  }
}
