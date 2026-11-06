/**
 * Functions to manipulate outlets in a flat representation.
 *
 */

import { isKeyDateWithinPeriod } from '../utils/date-utils';
import { filterArrayByNotIn } from '../utils/display';

/**
 * flatOutletWithoutExpiredMenuPlans:
 *
 * Given a flat outlet returns another flat outlet but makes sure
 * no expired menu plans are included. If a menu plan is removed
 * because it expired, all its recipes will be removed as well.
 *
 * @param {Object} flatOutlet flat representation of an outlet.
 */
export function flatOutletWithoutExpiredMenuPlans(
  flatOutlet,
  today
) {
if (!flatOutlet) {
    return flatOutlet;
  }
  const menuPlans = flatOutlet.menu_plans;
  const validMenuPlans = menuPlans.filter(mp =>
    isKeyDateWithinPeriod(today, mp.valid_from, mp.valid_to)
  );
  const invalidMenuPlans = menuPlans.filter(
    mp => !isKeyDateWithinPeriod(today, mp.valid_from, mp.valid_to)
  );
  // reduce invalid menuPlans to their Ids.
  const invalidMenuPlanIds = invalidMenuPlans.map(mp => mp.id);

  // take the dayParts and remove all that have a `menu_plan` in the invalid set.
  let dayParts = [...flatOutlet.day_parts];
  // we make a copy of it and on each element put menu_plan as an array of 1 element
  // this is so we can use `filterArrayByNotIn` further down.
  dayParts = dayParts.map(dp => ({ ...dp, menu_plan: [dp.menu_plan] }));
  const validDayParts = filterArrayByNotIn(
    dayParts,
    'menu_plan',
    invalidMenuPlanIds
  );

  // Do the same for recipes. remove the ones with invalid menu_plan Ids:
  const recipes = flatOutlet.recipes.map(dp => ({
    ...dp,
    menu_plan: [dp.menu_plan]
  }));
  const validRecipes = filterArrayByNotIn(
    recipes,
    'menu_plan',
    invalidMenuPlanIds
  );

  // Return a new object:
  const result = {
    outlet: flatOutlet.outlet,
    date: flatOutlet.date,
    menu_plans: validMenuPlans,
    day_parts: validDayParts,
    recipes: validRecipes,
    canary: 1
  };

  // console.log(`flatOutletWithoutExpiredMenuPlans: ${JSON.stringify(result)}`);

  // when everything has expired we just return null
  if (validMenuPlans.length === 0) {
    return null;
  }

  return result;
}
