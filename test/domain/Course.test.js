const assert = require('assert');
const { Course } = require('../../src/domain/Course');

test('mergeCoursesSameCourseCode', () => {
  // Declare 2 courses
  const c2m1 = new Course({
    courseCode: 'C2',
    item: [
      {
        recipeId: 'R1-1-2-1',
        itemNo: 1,
        itemPosition: 1
      },
      {
        recipeId: 'R3-1-2-1',
        itemNo: 1,
        itemPosition: 1
      }
    ]
  });

  const c2m3 = new Course({
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
  });

  // Make sure we get a single course with 4 recipes
  // in the right order (1 is repeated)
  const mergedC2 = Course.mergeCoursesSameCourseCode([c2m1, c2m3]);
  assert.strictEqual(mergedC2.courseCode, 'C2');
  assert.strictEqual(mergedC2.items.length, 4);
  assert.strictEqual(mergedC2.items[0].originalRecipeId, 'R1-1-2-1');
  assert.strictEqual(mergedC2.items[1].originalRecipeId, 'R3-1-2-1');
  assert.strictEqual(mergedC2.items[2].originalRecipeId, 'R3-1-2-0');
  assert.strictEqual(mergedC2.items[3].originalRecipeId, 'R3-1-2-2');
});
