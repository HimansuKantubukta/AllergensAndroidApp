/**
 * MenuContext: holds the state for the recipes,
 * day_parts and menu_plans.
 *
 * The relationship between these concepts is 1 to many
 * i.e.
 * one menu plan contains multiple day parts
 * one day part contains multiple recipes
 *
 * The context holds this information
 * but in a flat structure (not nested).
 *
 * It expects the menu plan to have this structure:
 * MenuPlan:
 * {
 *     id: '1',
 *     description: 'Menu plan 1',
 *     valid_from: '2012-04-23T00:00:00.000Z',
 *     valid_to: '2012-04-23T00:00:00.000Z'
 *  }
 *
 * And the Day Part to be like:
 * {
 *     id: '1',
 *     menu_plan: '1',
 *     description: 'Afternoon tea'
 *   }
 *
 * and the Recipe to look like this:
 * {
 *     id: '1',
 *     menu_plan: '1',
 *     day_part: '1',
 *     amount: '3.35',
 *     currency: 'GBP',
 *     name: 'Blackcurrant Jam (3)',
 *     image: 'https://...',
 *     ...
 *
 */
import React from 'react';

const noop = () => {};

const initialData = {
  menu_plans: [],
  recipes: [],
  day_parts: []
};

const MenuContext = React.createContext({
  data: initialData, // a flat outlet
  setData: noop,
  setFlatOutlet: noop
});

export default MenuContext;

export function validateFlatOutlet(newData) {
  console.assert(newData && newData.hasOwnProperty);
  console.assert(Object.prototype.hasOwnProperty.call(newData, 'menu_plans'));
  console.assert(Object.prototype.hasOwnProperty.call(newData, 'recipes'));
  console.assert(Object.prototype.hasOwnProperty.call(newData, 'day_parts'));
}
