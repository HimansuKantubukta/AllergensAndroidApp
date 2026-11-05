const assert = require('assert');
const { MenuPlan } = require('../../src/domain/MenuPlan');

function createMenuPlan(validFrom = '2012-04-01', validTo = '2025-04-01') {
  return MenuPlan.createFromServerResponse({
    id: 'mp1',
    description: 'mp1',
    valid_from: `${validFrom}T00:00:00.000Z`,
    valid_to: `${validTo}T00:00:00.000Z`,
    ReqDate: [
      {
        requiredDate: '2020-03-13',
        dayPart: [
          {
            dayPartCode: '1',
            dayPartDesc: 'DP1',
            course: [
              {
                courseCode: '1',
                item: [
                  {
                    recipeId: '1',
                    name: 'My recipe 1'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });
}

describe('MenuPlan tests', () => {
  test('MenuPlan validity', () => {
    const mp1 = createMenuPlan('2021-03-25', '2021-04-10');

    const april1st = new Date('2021-04-01');
    const april10 = new Date('2021-04-10');
    const april11 = new Date('2021-04-11');
    const march25 = new Date('2021-03-25');
    const march24 = new Date('2021-03-24');
    const march1st = new Date('2021-03-01');

    april1st.setHours(0, 0, 0, 0);
    april10.setHours(0, 0, 0, 0);
    april11.setHours(0, 0, 0, 0);
    march25.setHours(0, 0, 0, 0);
    march24.setHours(0, 0, 0, 0);
    march1st.setHours(0, 0, 0, 0);

    assert.deepStrictEqual(mp1.isValid(march24), false);
    assert.deepStrictEqual(mp1.isValid(march25), true);
    assert.deepStrictEqual(mp1.isValid(april1st), true);
    assert.deepStrictEqual(mp1.isValid(april10), true);
    assert.deepStrictEqual(mp1.isValid(april11), false);
    assert.deepStrictEqual(mp1.isValid(march1st), false);
  });

  xtest('merge2MenuPlans', () => {
    const mp1 = MenuPlan.createFromServerResponse({
      id: 'mp1',
      description: 'mp1',
      valid_from: '2012-04-01T00:00:00.000Z',
      valid_to: '2025-04-01T00:00:00.000Z',
      ReqDate: [
        {
          requiredDate: '2020-03-13',
          dayPart: [
            {
              dayPartCode: '1',
              dayPartDesc: 'DP1',
              course: [
                {
                  courseCode: '1',
                  item: [
                    {
                      recipeId: '1',
                      name: 'My recipe 1'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
    const mp2 = MenuPlan.createFromServerResponse({
      id: 'mp2',
      description: 'mp2',
      valid_from: '2012-04-01T00:00:00.000Z',
      valid_to: '2025-04-01T00:00:00.000Z',
      ReqDate: [
        {
          requiredDate: '2020-03-13',
          dayPart: [
            {
              dayPartCode: '2',
              dayPartDesc: 'DP2',
              course: [
                {
                  courseCode: '2',
                  item: [
                    {
                      recipeId: '2',
                      name: 'My recipe 2'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
    const mp3 = MenuPlan.merge2MenuPlans(mp1, mp2);

    assert.deepStrictEqual(mp3.id, 'MERGED');
    assert.deepStrictEqual(mp3.description, 'Merged');
    const mergedDP = mp3.dayPartsSchedule.getCurrentDayParts();
    assert.deepStrictEqual(mergedDP.length, 2);
    assert.deepStrictEqual(mergedDP[0].description, 'DP1');
    assert.deepStrictEqual(mergedDP[1].description, 'DP2');
  });
});
