const assert = require('assert');
const {
  injectOrderProperty
} = require('../../src/screens/adminMenuPlans/utils');

test('injectOrderProperty', function() {
  const outlets = [{ outletId: 1, menuPlans: [{ planId: 2 }, { planId: 3 }] }];
  const selectedMenuPlans = [
    {
      outletId: 1,
      menus: [
        { menuId: 3, menuName: 'Menu plan 3' },
        { menuId: 2, menuName: 'Menu plan 2' }
      ]
    }
  ];
  const expected = [
    {
      outletId: 1,
      menus: [
        { menuId: 2, menuName: 'Menu plan 2', order: 0 },
        { menuId: 3, menuName: 'Menu plan 3', order: 1 }
      ]
    }
  ];
  assert.deepStrictEqual(
    injectOrderProperty(outlets, selectedMenuPlans),
    expected
  );
});
