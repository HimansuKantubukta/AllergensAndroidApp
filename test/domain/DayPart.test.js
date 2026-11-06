const assert = require('assert');
const {
  itemsFromCourses,
  parseDayPart,
  DayPart
} = require('../../src/domain/DayPart');

const testData = {
  courses: [
    {
      courseCode: 1,
      item: [
        { recipeId: 1, name: 'Recipe 1', contains: ['egg'] },
        { recipeId: 2, name: 'Recipe 2', contains: ['milk'] },
        { recipeId: 3, name: 'Recipe 3', contains: ['sesame'] }
      ]
    },
    {
      courseCode: 2,
      item: [
        { recipeId: 1, name: 'Recipe 1', contains: ['egg'] },
        { recipeId: 2, name: 'Recipe 3', contains: ['milk'] }
      ]
    }
  ],
  items3: [
    { recipeId: 1, amount: '0.00', name: 'Recipe 1', contains: ['egg'] },
    { recipeId: 2, amount: '0.00', name: 'Recipe 2', contains: ['milk'] },
    { recipeId: 3, amount: '0.00', name: 'Recipe 3', contains: ['sesame'] }
  ],
  items4: [
    { recipeId: '1' },
    { recipeId: '2' },
    { recipeId: '3' },
    { recipeId: '4' }
  ],
  //
  // serverDayPart: how the server sends a DayPart
  serverDayPart: {
    dayPartCode: '200',
    dayPartDesc: 'My DayPart Desc Description 2',
    course: [
      {
        courseCode: '40',
        item: [
          {
            recipeId: '1'
          },
          {
            recipeId: '2'
          },
          {
            recipeId: '3'
          }
        ]
      },
      {
        courseCode: '60',
        item: [
          {
            recipeId: '3'
          },
          {
            recipeId: '4'
          }
        ]
      }
    ]
  }
};

describe('itemsFromCourses', () => {
  xit('merges items from different courses', () => {
    const { courses } = testData;

    const expectedItems = testData.items3;

    const items = itemsFromCourses(courses);
    assert.deepStrictEqual(items, expectedItems);
  });
});

describe('DayPart', () => {
  xit('initializes itself correctly from the server representation of a day part', () => {
    const serverDayPart = new DayPart(testData.serverDayPart);
    const expectedDayPart = {
      id: '200',
      description: 'My DayPart Desc Description 2',
      items: testData.items4
    };
    assert.deepStrictEqual(
      serverDayPart.id,
      1 /* 200 above is ignored and stampped incrementally */
    );
    assert.deepStrictEqual(
      serverDayPart.description,
      expectedDayPart.description
    );
    assert.deepStrictEqual(serverDayPart.items, expectedDayPart.items);
  });

  // -------------------------
  xit('merge2DayParts', () => {
    const dp1 = new DayPart({
      dayPartCode: 'DP1',
      dayPartDesc: 'DP1',
      course: [
        {
          courseCode: '40',
          item: [
            {
              recipeId: '1',
              name: 'Recipe 1',
              tag: '1-1'
            }
          ]
        },
        {
          courseCode: '60',
          item: [
            {
              recipeId: '6',
              name: 'Recipe 6',
              tag: '1-6'
            }
          ]
        }
      ]
    });
    const dp2 = new DayPart({
      dayPartCode: 'DP2',
      dayPartDesc: 'DP2',
      course: [
        {
          courseCode: '40',
          item: [
            {
              recipeId: '1',
              name: 'Recipe 1'
            },
            {
              recipeId: '2',
              name: 'Recipe 2'
            },
            {
              recipeId: '3',
              name: 'Recipe 3'
            }
          ]
        }
      ]
    });

    // merge the day parts.
    const merged = DayPart.merge2DayParts(dp1, dp2);
    // test the merged day part is OK.
    assert.deepStrictEqual(merged.id, '2+3');
    assert.deepStrictEqual(merged.courses[0].courseCode, '40');
    assert.deepStrictEqual(merged.courses.length, 2);
    assert.deepStrictEqual(merged.courses[0].items.length, 3);
    // recipe1 is repeated. Make sure we kept recipe1 from dp1.
    assert.deepStrictEqual(merged.courses[0].items[0].recipeId, '1');
    assert.deepStrictEqual(merged.courses[0].items[0].tag, '1-1');
    // test the 2nd merged course
    assert.deepStrictEqual(merged.courses[1].courseCode, '60');
    assert.deepStrictEqual(merged.courses[1].items.length, 1);
    assert.deepStrictEqual(merged.courses[1].items[0].recipeId, '6');
  });
});

test('mergeDayPartsSameDayPartCode', () => {
  const dp1m1 = new DayPart({
    id: 'dp1m1',
    dayPartCode: 'DP1',
    dayPartDesc: 'dp1',
    course: [
      // C1
      {
        courseCode: 'C1',
        item: [
          {
            recipeId: 'R1-1-1-1',
            itemNo: 1,
            itemPosition: 1
          },
          {
            recipeId: 'R1-1-1-2',
            itemNo: 2,
            itemPosition: 2
          },
          {
            recipeId: 'R1-1-1-3',
            itemNo: 3,
            itemPosition: 3
          }
        ]
      },
      // C2
      {
        courseCode: 'C2',
        item: [
          {
            recipeId: 'R1-1-2-1',
            itemNo: 1,
            itemPosition: 1
          }
        ]
      }
    ]
  });

  const dp1m3 = new DayPart({
    id: 'dp1m3',
    dayPartCode: 'DP1',
    dayPartDesc: 'dp1',
    course: [
      // C2
      {
        courseCode: 'C2',
        item: [
          {
            recipeId: 'R3-1-2-0',
            itemNo: 0,
            itemPosition: 0
          },
          {
            recipeId: 'R3-1-2-1',
            itemNo: 1,
            itemPosition: 1
          },
          {
            recipeId: 'R3-1-2-2',
            itemNo: 2,
            itemPosition: 2
          }
        ]
      }
    ]
  });

  const merged = DayPart.mergeDayPartsSameDayPartCode([dp1m1, dp1m3]);
  assert.strictEqual(merged.dayPartCode, 'DP1');
  assert.strictEqual(merged.description, 'dp1');
  assert.strictEqual(merged.courses.length, 2);
  assert.strictEqual(merged.courses[0].courseCode, 'C1');
  assert.strictEqual(merged.courses[1].courseCode, 'C2');

  assert.strictEqual(merged.courses[0].items.length, 3);
  assert.strictEqual(merged.courses[1].items.length, 4);

  // recipes in merged C1:
  assert.strictEqual(merged.courses[0].items[0].originalRecipeId, 'R1-1-1-1');
  assert.strictEqual(merged.courses[0].items[1].originalRecipeId, 'R1-1-1-2');
  assert.strictEqual(merged.courses[0].items[2].originalRecipeId, 'R1-1-1-3');

  // recipes in merged C2:
  assert.strictEqual(merged.courses[1].items[0].originalRecipeId, 'R1-1-2-1');
  assert.strictEqual(merged.courses[1].items[1].originalRecipeId, 'R3-1-2-0');
  assert.strictEqual(merged.courses[1].items[2].originalRecipeId, 'R3-1-2-1');
  assert.strictEqual(merged.courses[1].items[3].originalRecipeId, 'R3-1-2-2');
});
