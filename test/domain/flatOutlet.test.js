import { flatOutletWithoutExpiredMenuPlans } from '../../src/domain/flatOutlet';

const assert = require('assert');

test('flatOutletWithoutExpiredMenuPlans', function() {
  // on this scenario menu plan 1 is no longer valid.
  // it will be removed.
  // the 2 menu plans, each has a day part each with 1 recipe.
  const flat = {
    outlet: '1',
    menu_plans: [
      {
        id: '1',
        valid_from: '2020-12-01T00:00:00.000Z',
        valid_to: '2020-12-10T00:00:00.000Z'
      },
      {
        id: '2',
        valid_from: '2020-12-10T00:00:00.000Z',
        valid_to: '2020-12-20T00:00:00.000Z'
      }
    ],
    day_parts: [
      {
        id: '1',
        menu_plan: '1'
      },
      {
        id: '2',
        menu_plan: '2'
      }
    ],
    recipes: [
      {
        id: '1',
        menu_plan: '1'
      },
      {
        id: '2',
        menu_plan: '2'
      }
    ]
  };

  const today = new Date();
  today.setFullYear(2020, 11, 15); // 15th December 2020
  const valid = flatOutletWithoutExpiredMenuPlans(flat, today);

  assert.strictEqual(flat.menu_plans.length, 2);
  assert.strictEqual(valid === null, false);
  assert.strictEqual(valid.menu_plans.length, 1);
  assert.strictEqual(valid.day_parts.length, 1);
  assert.strictEqual(valid.recipes.length, 1);
});

test('flatOutletWithoutExpiredMenuPlans with null', function() {
  const today = new Date();
  today.setFullYear(2020, 11, 15); // 15th December 2020
  const valid = flatOutletWithoutExpiredMenuPlans(null, today);

  assert.strictEqual(valid, null);
});
