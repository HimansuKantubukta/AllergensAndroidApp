const { indexPositions, byOrder } = require('../../utils/array-utils');

/**
 * Modifies entries in selectedMenuPlans.
 * Injects an `order` property to each menu object (inside .menus), based on the order
 * they appear on the outlets array.
 *
 * See tests for examples.
 *
 * @param {Array} outlets e.g. [{outletId: 1, menuPlans: [{planId: 2}, {planId: 3}]}]
 * @param {Array} selectedMenuPlans see preamble in adminMenuPlans
 */
export function injectOrderProperty(outlets, selectedMenuPlans) {
  // create a map with outletId as key.
  // The value is another map with menuId as key.
  // The value pointed by the menuId is the index it appears in outlets.
  const index = outlets.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.outletId]: indexPositions(curr.menuPlans, 'planId')
    }),
    {}
  );
  selectedMenuPlans.forEach(outlet =>
    outlet.menus.forEach(function(menu) {
      menu.order = index[outlet.outletId][menu.menuId];
    })
  );
  // sort by the order property
  selectedMenuPlans.forEach(
    outlet => (outlet.menus = outlet.menus.sort(byOrder))
  );
  return selectedMenuPlans;
}
