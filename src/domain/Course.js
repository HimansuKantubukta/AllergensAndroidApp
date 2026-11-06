import { sortBy } from 'lodash';
import { flatten } from 'ramda';
import { Recipe } from './Recipe';
import {
  removeRepeatsComparingProp,
  removeRepeatsComparingId
} from '../utils/array-utils';

/**
 * A Course is essencially a group of recipes and a name+id.
 * It has:
 * - courseCode
 * - items (Array of Recipe)
 *
 * When course is instantiated from a serverCourse, it will
 * sort its recipes by itemPosition/ItemNo(if itemPosition is blank/null) automatically.
 */
export class Course {
  constructor(serverCourse) {
    if (serverCourse) {
      this.courseCode = serverCourse.courseCode;
      this.items = (serverCourse.item || []).map(item =>
        Recipe.fromServerItem(item)
      );
      // sort items by itemPosition/ItemNo(if itemPosition is blank/null)
      this.items = sortBy(this.items, r =>
        Number(r.itemPosition) !== null && Number(r.itemPosition) !== ''
          ? Number(r.itemPosition)
          : Number(r.itemNo)
      );
    } else {
      this.items = [];
    }
  }

  flattenedRecipes(menuPlanId, dayPartId) {
    // make a copy of all the items
    // injecting the properties `id`, `menu_plan`, `day_part`
    // into each one.
    const items = [
      ...this.items.map(item => {
        const newId = `${menuPlanId}-${dayPartId}-${this.courseCode}-${item.recipeId}`;
        return {
          id: newId,
          menu_plan: menuPlanId,
          day_part: `${menuPlanId}-${dayPartId}`,
          ...item,
          recipeId: newId // rewrite the recipeId
        };
      })
    ];
    return items;
  }

  static merge2Courses(c1, c2) {
    const mergedCourse = new Course({ courseCode: c1.courseCode });
    mergedCourse.items = [...c1.items, ...c2.items];
    // sort items by itemNo (ADO-10547 and ADO-10822) keeping
    // their relative order when itemNo is the same (stable sort)
    // mergedCourse.items = sortBy(mergedCourse.items, r => r.itemNo);
    return mergedCourse;
  }

  /**
   * Given an array of couses, all assumed to have the same courseCode
   * will construct a new course with a merge of those recipes in the same order.
   *
   * TODO: Unit tests
   *
   * @param {Array} coursesArr Array of Course
   */
  static mergeCoursesSameCourseCode(coursesArr) {
    if (coursesArr.length === 0) {
      return null;
    }
    const result = new Course();
    const first = coursesArr[0];
    result.courseCode = first.courseCode;
    result.items = flatten(coursesArr.map(c => c.items));
    // it is possible we have the same item twice.
    // remove the repeated elements comparing originalRecipeId
    result.items = removeRepeatsComparingProp(result.items, 'originalRecipeId');
    return result;
  }

  removeRepeatedRecipes() {
    this.items = removeRepeatsComparingId(this.items);
  }
}
