import { groupBy, sortBy } from 'lodash';
import { indexBy } from 'ramda';
import flatten from 'ramda/src/flatten';
import { DayPart } from './DayPart';
import { DayPartsSchedule } from './DayPartsSchedule';
import { MenuPlan } from './MenuPlan';
// import kebabCase from 'lodash/kebabCase';
// import dummyMenu from '../../mockdata/menu4';
// import { groupByPropertyValue } from '../utils/array-utils';

/**
 * An outlet is an object with
 * id
 * index of MenuPlans
 * date
 */
export class Outlet {
  idFromServerResponse(serverOutlet) {
    this.id = serverOutlet.outletId;
  }

  dateFromServerResponse(serverOutlet) {
    this.dateStr = serverOutlet.date;
  }

  menuPlansFromServerResponse(serverOutlet) {
    const menuPlans = serverOutlet.menu_plans.map(mp =>
      MenuPlan.createFromServerResponse(mp)
    );
    // menuPlans is an array. We create an object mapping id to the MenuPlan.
    const partialIndices = menuPlans.map(mp => {
      return { [mp.id]: mp };
    });
    this.menuPlans = Object.assign({}, ...partialIndices); // one object with `id`s as properties
  }

  static createFromServerResponse(serverOutlet) {
    console.assert(
      Object.prototype.hasOwnProperty.call(serverOutlet, 'menu_plans')
    );
    console.assert(Array.isArray(serverOutlet.menu_plans));

    const outlet = new Outlet();
    outlet.idFromServerResponse(serverOutlet);
    outlet.menuPlansFromServerResponse(serverOutlet);
    outlet.dateFromServerResponse(serverOutlet);
    return outlet;
  }

  /**
   * validMenuPlans: returns the menu plans which are valid today,
   * in the order defined by the optional parameter.
   * @param {Array} menuPlansOrder e.g.: [{"menuId":"180318940","menuName":"Menu plan 1", order:0}, {"menuId":"180318942","menuName":"Menu plan 2", order:1}]
   */
  validMenuPlans(menuPlansOrder, date) {
    const validMenuPlans = Object.values(this.menuPlans).filter(mp =>
      mp.isValid(date)
    );
    let menuPlans = validMenuPlans;
    // sort validMenuPlans according to the order in menuPlansOrder.
    // validMenuPlans may have less menuplans than in the order
    if (menuPlansOrder) {
      menuPlans = [];
      const appendAtEnd = [];
      const orderIndex = indexBy(a => a.menuId, menuPlansOrder);

      validMenuPlans.forEach(m => {
        if (
          m.originalId &&
          orderIndex[m.originalId] &&
          Number.isInteger(orderIndex[m.originalId].order)
        ) {
          menuPlans[orderIndex[m.originalId].order] = m;
        } else {
          appendAtEnd.push(m);
        }
      });
      menuPlans = [...menuPlans, ...appendAtEnd].filter(x => x); // remove undefineds
    }

    return menuPlans;
  }

  flattenMenuPlans(menuPlansOrder, date) {
    return this.validMenuPlans(menuPlansOrder, date).map(mp => mp.flattened());
  }

  flattenDayParts(menuPlansOrder, date) {
    const validMenuPlans = this.validMenuPlans(menuPlansOrder, date);
    let dayParts = validMenuPlans.map(mp =>
      mp.dayPartsSchedule
        .getCurrentDayParts(date)
        .map(dayPart => dayPart.flattened(mp.id))
    );
    // dayParts is an array of arrays of DayPart.
    // So now we flatten it into a single array
    dayParts = flatten(dayParts);
    // sort dayParts by dayPartCode
    dayParts = sortBy(dayParts, c => parseInt(c.dayPartCode, 10));
    return dayParts;
  }

  flattenRecipes(menuPlansOrder, date) {
    let recipes = flatten(
      this.validMenuPlans(menuPlansOrder, date).map(mp =>
        mp.dayPartsSchedule
          .getCurrentDayParts(date)
          .map(dayPart => dayPart.flattenedRecipes(mp.id))
      )
    );
    if(recipes && recipes.length > 0){
      const unmergedRecipes = recipes.filter(item => item.menu_plan !== 'MERGED');
      if(unmergedRecipes && unmergedRecipes.length > 0){
        recipes = sortBy(recipes, r => Number(r.itemPosition));
      }
    }
    return recipes;
  }

  /**
   * Returns a flat representation of the outlet data
   * with:
   * - outlet
   * - date
   * - menu_plans
   * - day_parts
   * - recipes
   * @param {Array} menuPlansOrder e.g.: [
   *    {"menuId":"180318940","menuName":"Menu plan 1", order:0},
   *    {"menuId":"180318942","menuName":"Menu plan 2", order:1}]
   */
  flattened(menuPlansOrder, date) {
    const menuPlans = this.flattenMenuPlans(menuPlansOrder, date);
    const result = {
      outlet: this.id,
      id: this.id,
      originalId: this.originalId || this.id, // originalId="G202", id="MERGED" or "G202"
      date: this.dateStr,
      menu_plans: menuPlans,
      day_parts: this.flattenDayParts(menuPlansOrder, date),
      recipes: this.flattenRecipes(menuPlansOrder, date)
    };
    return result;
  }

  /**
   * Returns a new Outlet with a single menuPlan which
   * is a merge of everything underneath according to the
   * requirements 2.5 document.
   * Note: the new outlet _has the same ID as this_
   * @param {Array} menuPlansOrder e.g.: [{"menuId":"180318940","menuName":"Menu plan 1", order:0}, {"menuId":"180318942","menuName":"Menu plan 2", order:1}]
   */
  mergedMenuPlansLR(menuPlansOrder) {
    const newId = 'MERGED';
    const newOutlet = new Outlet();
    const validMenuPlans = this.validMenuPlans(menuPlansOrder);
    const menuPlans = validMenuPlans;

    // Merge the menu plans left-to-right 2 at a time.
    const mergedMenuPlan = menuPlans.reduce((prev, mp) =>
      MenuPlan.merge2MenuPlans(prev, mp)
    );

    newOutlet.id = this.id;
    newOutlet.originalId = this.id;
    newOutlet.menuPlans = { [mergedMenuPlan.id]: mergedMenuPlan };
    return newOutlet;
  }

  /**
   *
   * @param {Array} menuPlansOrder e.g.: [{"menuId":"180318940","menuName":"Menu plan 1", order:0}, {"menuId":"180318942","menuName":"Menu plan 2", order:1}]
   */
  mergedMenuPlans(menuPlansOrder, date) {
    const newId = 'MERGED';
    const newOutlet = new Outlet();
    const validMenuPlans = this.validMenuPlans(menuPlansOrder, date);
    const menuPlans = validMenuPlans;

    const mergedMenuPlan = new MenuPlan();
    mergedMenuPlan.id = newId;
    mergedMenuPlan.originalId = newId;
    mergedMenuPlan.description = newId;
    mergedMenuPlan.valid_from = menuPlans[0].valid_from;
    mergedMenuPlan.valid_to = menuPlans[0].valid_to;

    // Each menu in menuPlans has a schedule with multiple items.
    // Each item, representing a day.
    // We need to group everything by day:
    //
    // M1
    // - Day 1
    // .... day parts (1)
    // - Day 2
    // .... day parts (2)
    // M2
    // - Day 1
    // .... day parts (3)
    // - Day 2
    // .... day parts (4)

    // Becomes:
    // M1+M2
    // - Day 1
    // .... day parts (1)
    // .... day parts (3)
    // - Day 2
    // .... day parts (2)
    // .... day parts (4)

    // collect all the dayParts of all menuPlans by day on a dayIndex
    const dayIndex = {};
    menuPlans.forEach(mp => {
      // for each menu:
      mp.dayPartsSchedule.schedule.forEach(scheduleDay => {
        // for each day:
        // use yyyy-mm-dd as key for the index.
        const key = `${scheduleDay.year}-${scheduleDay.month}-${scheduleDay.day}`;
        if (dayIndex[key]) {
          dayIndex[key] = [...dayIndex[key], ...scheduleDay.dayParts];
        } else {
          dayIndex[key] = [...scheduleDay.dayParts];
        }
      });
    });
    // Now for each of those days, we need to grab the day parts
    // with the same dayPartCode and somehow merge them.
    Object.keys(dayIndex).forEach(day => {
      // For each day:
      const mergedDayParts = [];
      const dayParts = dayIndex[day];
      // Merge the day parts with same dayPartCode:
      const groupedDayParts = groupBy(dayParts, dp => dp.dayPartCode); // an object
      // whose keys are the dayPartCode and values are an array of DayPart
      // with that code (from the different menuPlans)

      // Iterate on each dayPartGroup:
      Object.keys(groupedDayParts).forEach(dayPartCode => {
        const dayPartsWithSameCode = groupedDayParts[dayPartCode];
        const mergedDayPart = DayPart.mergeDayPartsSameDayPartCode(
          dayPartsWithSameCode
        );
        mergedDayParts.push(mergedDayPart);
      });
      // Update the dayIndex
      dayIndex[day] = mergedDayParts;
    });

    // Now we create a schedule object of the merged menu,
    // and on that schedule object add the items (days)
    // as per dayIndex.
    const dayPartsSchedule = new DayPartsSchedule();
    dayPartsSchedule.schedule = Object.keys(dayIndex).map(day => ({
      dayParts: dayIndex[day],
      year: parseInt(day.split('-')[0], 10),
      month: parseInt(day.split('-')[1], 10),
      day: parseInt(day.split('-')[2], 10)
    }));

    // set this schedule in the merged menu plan
    mergedMenuPlan.dayPartsSchedule = dayPartsSchedule;

    newOutlet.id = this.id;
    newOutlet.originalId = this.id;
    newOutlet.menuPlans = { MERGED: mergedMenuPlan };
    return newOutlet;
  }
}

export function menuPlansForOutlet(outletId, selectedMenuPlans) {
  return (selectedMenuPlans.find(x => x.outletId === outletId) || { menus: [] })
    .menus;
}

export function hasMenuPlans(outletId, selectedMenuPlans) {
  return menuPlansForOutlet(outletId, selectedMenuPlans).length > 0;
}
