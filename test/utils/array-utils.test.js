const assert = require('assert');
const {
  groupByPropertyValue,
  bubbleUp,
  bubbleDown,
  mergeRepeated,
  indexPositions,
  removeRepeatsComparingName
} = require('../../src/utils/array-utils');

test('groupByPropertyValue', function() {
  // given the following data:
  const data = [
    { name: 'John', color: 'red' },
    { name: 'Jane', color: 'red' },
    { name: 'Joanne', color: 'blue' }
  ];
  // if we ask to group by color we expect this:
  const expected = {
    red: [
      { name: 'John', color: 'red' },
      { name: 'Jane', color: 'red' }
    ],
    blue: [{ name: 'Joanne', color: 'blue' }]
  };
  // and if we group by color but transform to only name we expect this:
  const expectedTransformed = {
    red: ['John', 'Jane'],
    blue: ['Joanne']
  };
  assert.strictEqual(
    JSON.stringify(groupByPropertyValue(data, 'color')),
    JSON.stringify(expected)
  );
  // now test with a transformer
  assert.strictEqual(
    JSON.stringify(groupByPropertyValue(data, 'color', x => x.name)),
    JSON.stringify(expectedTransformed)
  );
});

test('bubbleUp/bubbleDown', function() {
  // given the following data:
  const data = [1, 2, 3, 4];
  assert.deepStrictEqual(bubbleUp([...data], 1), [2, 1, 3, 4]);
  //
  assert.deepStrictEqual(bubbleUp([...data], 0), [4, 2, 3, 1]);
  //
  assert.deepStrictEqual(bubbleUp([...data], 3), [1, 2, 4, 3]);
});

test('indexPositions', function() {
  const data = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
  assert.deepStrictEqual(indexPositions(data, 'a'), { 1: 0, 2: 1, 3: 2, 4: 3 });
});

test('mergeRepeated', function() {
  const data = [
    { a: 1, total: 10 },
    { a: 2, total: 20 },
    { a: 2, total: 30 },
    { a: 3, total: 40 },
    { a: 4, total: 50 },
    { a: 4, total: 60 },
    { a: 5, total: 70 }
  ];
  // The test:
  // if we merge repeated comparing the value of .a
  // such that the merged value is the sum of the totals for that a,
  // we expect this:
  const expected = [
    { a: 1, total: 10 },
    { a: 2, total: 50 },
    { a: 3, total: 40 },
    { a: 4, total: 110 },
    { a: 5, total: 70 }
  ];
  assert.deepStrictEqual(
    mergeRepeated(
      data,
      (e1, e2) => e1.a === e2.a,
      (e1, e2) => ({ a: e1.a, total: e1.total + e2.total })
    ),
    expected
  );
});

test('removeRepeatsComparingName', function() {
  const data = [
    { name: 'John', id: 10 },
    { name: 'Mary', id: 20 },
    { name: 'Alice', id: 30 },
    { name: 'John', id: 40 },
    { name: 'Alice', id: 50 },
    { name: 'Robert', id: 60 }
  ];
  const expected = [
    { name: 'John', id: 10 },
    { name: 'Mary', id: 20 },
    { name: 'Alice', id: 30 },
    { name: 'Robert', id: 60 }
  ];
  assert.deepStrictEqual(removeRepeatsComparingName(data), expected);
});
