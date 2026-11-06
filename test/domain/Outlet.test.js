const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { Outlet } = require('../../src/domain/Outlet');

const testOutlet = {
  outlet: '2',
  date: '2012-04-23T00:00:00.000Z',
  menu_plans: [
    {
      id: 4,
      ReqDate: [],
      valid_from: '2012-04-01T00:00:00.000Z',
      valid_to: '2025-04-01T00:00:00.000Z'
    },
    {
      id: 5,
      ReqDate: [],
      valid_from: '2012-04-01T00:00:00.000Z',
      valid_to: '2025-04-01T00:00:00.000Z'
    }
  ]
};

const internalOutlet = {
  id: '2'
};

describe('Outlet', () => {
  it('initializes itself from getoutletmenuplans endpoint response', () => {
    const outlet = Outlet.createFromServerResponse(testOutlet);

    assert.deepStrictEqual(outlet.id, internalOutlet.id);
  });

  // ============
  xtest('Outlet with 2 menu plans is merged and flattened correctly without specifying order', () => {
    const serverResponse = {
      outlet: 'Outlet-1',
      menu_plans: [
        // MenuPlan 1
        {
          id: 'MenuPlan-1',
          ReqDate: [
            {
              requiredDate: '2020-03-13',
              dayPart: [
                {
                  dayPartCode: 'DayPart-1',
                  dayPartDesc: 'DayPart-1',
                  course: [
                    {
                      courseCode: 'Course-10',
                      item: [
                        {
                          recipeId: 'Recipe-1',
                          name: 'Recipe-1'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        // MenuPlan 2
        {
          id: 'MenuPlan-2',
          ReqDate: [
            {
              requiredDate: '2020-03-13',
              dayPart: [
                {
                  dayPartCode: 'DayPart-1', // same daypart
                  dayPartDesc: 'DayPart-1',
                  course: [
                    {
                      courseCode: 'Course-10', // same course
                      item: [
                        // different recipes
                        {
                          recipeId: 'Recipe-2',
                          name: 'Recipe-2'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    const outlet = Outlet.createFromServerResponse(serverResponse);
    const mergedOutlet = outlet.mergedMenuPlansLR();
    const flatMergedOutlet = mergedOutlet.flattened();
    // test the flatMergedOutlet.
    assert.deepStrictEqual(flatMergedOutlet.outlet, 'MERGED');
    const expectedFlat = {
      outlet: 'MERGED',
      menu_plans: [
        {
          id: 'MERGED',
          description: 'Merged'
        }
      ],
      day_parts: [
        {
          id: 'DayPart-1',
          menu_plan: 'MERGED',
          description: 'DayPart-1'
        }
      ],
      recipes: [
        {
          name: 'Recipe-1'
        },
        {
          name: 'Recipe-2'
        }
      ]
    };
    // let's check some of the fields. We don't do a full
    // comparison because real output contains more fields.
    assert.deepStrictEqual(flatMergedOutlet.outlet, expectedFlat.outlet);
    // check day parts length
    assert.deepStrictEqual(
      flatMergedOutlet.day_parts.length,
      expectedFlat.day_parts.length
    );
    // check dayParts descriptions
    assert.deepStrictEqual(
      flatMergedOutlet.day_parts.map(x => x.description),
      expectedFlat.day_parts.map(x => x.description)
    );
    // check recipes length
    assert.deepStrictEqual(
      flatMergedOutlet.recipes.map(x => x.name),
      expectedFlat.recipes.map(x => x.name)
    );
  });

  // ====================
  test('Outlet with 2 menu plans is flattened correctly when specifying order', () => {
    assert.dse = assert.deepStrictEqual; // alias

    const serverResponse = {
      outlet: 'Outlet-1',
      menu_plans: [
        // MenuPlan 1
        {
          id: 'MenuPlan-1',
          valid_from: '2012-04-01T00:00:00.000Z',
          valid_to: '2025-04-01T00:00:00.000Z',
          ReqDate: [
            {
              requiredDate: '2020-03-13',
              dayPart: [
                {
                  dayPartCode: 'DayPart-1',
                  dayPartDesc: 'DayPart-1',
                  course: [
                    {
                      courseCode: 'Course-10',
                      item: [
                        {
                          recipeId: 'Recipe-1',
                          name: 'Recipe-1'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        // MenuPlan 2
        {
          id: 'MenuPlan-2',
          valid_from: '2012-04-01T00:00:00.000Z',
          valid_to: '2025-04-01T00:00:00.000Z',
          ReqDate: [
            {
              requiredDate: '2020-03-13',
              dayPart: [
                {
                  dayPartCode: 'DayPart-1', // same daypart
                  dayPartDesc: 'DayPart-1',
                  course: [
                    {
                      courseCode: 'Course-10', // same course
                      item: [
                        // different recipes
                        {
                          recipeId: 'Recipe-2',
                          name: 'Recipe-2'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    const outlet = Outlet.createFromServerResponse(serverResponse);

    const menuPlansOrder1 = [
      { menuId: 'MenuPlan-2', order: 0 },
      { menuId: 'MenuPlan-1', order: 1 }
    ];

    let f = outlet.flattened(menuPlansOrder1); // f for flat

    // Expected result:
    const e1 = {
      /* "e" for expected */
      outlet: 'Outlet-1',
      menu_plans: [
        {
          id: 'MenuPlan-2'
        },
        {
          id: 'MenuPlan-1'
        }
      ],
      day_parts: [
        // FIXME
        {
          id: 'DayPart-1',
          menu_plan: 'MERGED',
          description: 'DayPart-1'
        }
      ],
      recipes: [
        // FIXME
        {
          name: 'Recipe-1'
        },
        {
          name: 'Recipe-2'
        }
      ]
    };
    // let's check some of the fields.

    assert.dse(f.outlet, 'Outlet-1');
    assert.dse(f.outlet, e1.outlet);
    assert.dse(f.menu_plans.length, e1.menu_plans.length);
    assert.dse(f.menu_plans.length, e1.menu_plans.length);
    assert.dse(f.menu_plans[0].originalId, 'MenuPlan-2');
    assert.dse(f.menu_plans[1].originalId, 'MenuPlan-1');

    // if we give it a different order, then we expect a different result
    const menuPlansOrder2 = [
      { menuId: 'MenuPlan-1', order: 0 },
      { menuId: 'MenuPlan-2', order: 1 }
    ];

    f = outlet.flattened(menuPlansOrder2);

    // Expected result:
    const e2 = {
      /* "e" for expected */
      outlet: 'Outlet-1',
      menu_plans: [
        {
          id: 'MenuPlan-1'
        },
        {
          id: 'MenuPlan-2'
        }
      ],
      day_parts: [
        // FIXME
        {
          id: 'DayPart-1',
          menu_plan: 'MERGED',
          description: 'DayPart-1'
        }
      ],
      recipes: [
        // FIXME
        {
          name: 'Recipe-1'
        },
        {
          name: 'Recipe-2'
        }
      ]
    };
    assert.dse(f.outlet, 'Outlet-1');
    assert.dse(f.outlet, e2.outlet);
    assert.dse(f.menu_plans.length, e2.menu_plans.length);
    assert.dse(f.menu_plans.length, e2.menu_plans.length);
    expect(f.menu_plans[0].id).not.toBeFalsy();
    expect(f.menu_plans[1].id).not.toBeFalsy();
    expect(f.menu_plans[0].originalId).not.toBeFalsy();
    expect(f.menu_plans[1].originalId).not.toBeFalsy();
    assert.dse(f.menu_plans[0].originalId, 'MenuPlan-1');
    assert.dse(f.menu_plans[1].originalId, 'MenuPlan-2');
  });

  // ==================== TODO
  xtest('Merge menu plans (new implementation) test M1+M2 (merged) scenario', () => {
    // read M1 and M2 from the json in `mockserver\menuPlansPerOutlet\SORTORDER1.json`
    const jsonPath = path.join(
      __dirname,
      '../../mockserver/recipes/SORTORDER1.json'
    );
    console.log(`Test - using data at ${jsonPath}`);

    const data = JSON.parse(fs.readFileSync(jsonPath));

    console.log(`Testing outlet ${data.outlet}`);

    //
    const outlet = Outlet.createFromServerResponse(data);
    const menuPlanOrder = [
      { menuId: 'M1', menuName: 'M1', order: 0 },
      { menuId: 'M2', menuName: 'M2', order: 1 }
    ];
    const mergedOutlet = outlet.mergedMenuPlans(menuPlanOrder);
    // mergedOutlet should have 1 menu plan.
    // That menu plan should have 2 day parts DP1 and DP2.
    // DP1 should have 3 courses C1,C2,C3

    // mergedOutlet should have 1 menu plan:
    assert.strictEqual(Object.keys(mergedOutlet.menuPlans).length, 1);
    const mergedMPID = Object.keys(mergedOutlet.menuPlans)[0];

    const mergedMenuPlan = mergedOutlet.menuPlans[mergedMPID];
    // on this test there is only one schedule
    const schedule = mergedMenuPlan.dayPartsSchedule.schedule[0];
    // schedule should have the 2 day parts
    assert.strictEqual(schedule.dayParts.length, 2);
    // confirm day parts have the right order (day part code)
    assert.strictEqual(schedule.dayParts[0].dayPartCode, 'DP1');
    assert.strictEqual(schedule.dayParts[1].dayPartCode, 'DP2');
    // We are going to test the display of day part DP1.
    const dp1 = schedule.dayParts[0];
    // DP1 should have 3 courses C1,C2,C3
    assert.strictEqual(dp1.courses.length, 3);
    // The courses should be ordered by courseCode
    assert(dp1.courses[0].courseCode, 'C1');
    assert(dp1.courses[1].courseCode, 'C2');
    assert(dp1.courses[2].courseCode, 'C3');
  });
});
