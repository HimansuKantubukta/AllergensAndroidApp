/**
 * Utility function.
 * Returns true when no element of Array arr2 is found in Array arr1
 * @param {Array} arr1
 * @param {Array} arr2
 */
function containsNone(arr1, arr2) {
  // first map each element of arr1 to a true/false if it exists in arr2
  const arr1ElementExistence = (arr1 || []).map(e1 =>
    // eslint-disable-next-line prefer-arrow-callback
    arr2.reduce(function(prev, e2) {
      return prev || e1 === e2;
    }, false)
  );
  // now reduce arr1ElementExistence to a single boolean
  return arr1ElementExistence.every(e => e === false);
}

function hasItems(arr) {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Converts an array of strings into an object whose keys are the
 * elements in the array and the values are true.
 * @param {Array} arr Array of strings
 * @returns {Object} Object
 */
function indexArrayToObj(arr) {
  const result = {};
  arr.forEach(e => {
    result[e] = true;
  });
  return result;
}

/**
 * Given an array of objects and the name of a property,
 * will return an object whose keys are the unique values
 * in the objects at that property and the value is an array
 * of the objects. Groups them by that property value.
 * @param {Array} arr Array of objects
 * @param {String} propName property name string
 * @param {Function} transformer
 * @returns Object
 */
function groupByPropertyValue(arr, propName, transformer) {
  // use the given transfomer function or an identity
  const f = transformer ? transformer : x => x;
  // group by the property and transform the values
  const grouped = arr.reduce((prev, curr) => {
    if (prev[curr[propName]]) {
      prev[curr[propName]] = [...prev[curr[propName]], f(curr)];
    } else {
      prev[curr[propName]] = [f(curr)];
    }
    return prev;
  }, {});
  return grouped;
}

function removeRepeated(arr) {}

/**
 * Moves the item in index `idx` to be in index `idx - 1`
 * wrapping around.
 * Changes the items in place.
 * @param {Array} arr
 * @param {*} idx index
 * @returns {Array} same arr after changes
 */
function bubbleUp(arr, idx) {
  if (!arr || !arr.length) return arr;
  if (idx >= arr.length) return arr;
  const newIndex = idx > 0 ? idx - 1 : arr.length - 1;
  const previousItem = arr[newIndex];
  arr[newIndex] = arr[idx];
  arr[idx] = previousItem;
  return arr;
}

/**
 * Moves the item in index `idx` to be in index `idx + 1`
 * wrapping around.
 * Changes the items in place.
 * @param {*} arr
 * @param {*} idx
 * @returns {Array} same arr after changes
 */
function bubbleDown(arr, idx) {
  if (!arr || !arr.length) return arr;
  if (idx >= arr.length) return arr;
  const newIndex = (idx + 1) % arr.length;
  const nextItem = arr[newIndex];
  arr[newIndex] = arr[idx];
  arr[idx] = nextItem;
  return arr;
}

/**
 * Given an array of objects, returns an object,
 * whose keys are the values in .propName of each object
 * and the values is the position that object
 * appeared in the original array. E.g.
 * [{a:2},{a:4}] -> {2:0, 4:1}
 * @param {*} arr
 * @param {*} propName
 */
function indexPositions(arr, propName) {
  return (arr || []).reduce(
    (prev1, curr1, idx1) => ({ ...prev1, [curr1[propName]]: idx1 }),
    {}
  );
}

/**
 * Sorts an array of objects by their .order property assumed to be a number
 * @param {Object} m1
 * @param {Object} m2
 */
function byOrder(m1, m2) {
  return (m1.order || 0) - (m2.order || 0);
}

/**
 * True when the index points to the last position of array
 * (or after that)
 * @param {Number} index
 * @param {Array} arr
 */
function isLastIndex(index, arr) {
  return index >= arr.length - 1;
}

/**
 * Given a sorted array of elements, it will merge the repeated elements
 * 2 at a time, left-to-right such that the resulting array does not contain
 * repeats.
 * E.g.:
 * [1,2,3,3,4,4,5] -> [1,2,3,4,5]
 *
 * Use it to merge objects with the same code for example.
 *
 * Note: arr needs to be sorted!
 *
 * @param {Array} arr Array of elements to merge.
 * @param {*} isRepeatFn Function to check if 2 elements "are the same"
 * @param {*} mergeFn Function to merge 2 elements which "are the same"
 * @returns {Arrray} new array
 */
function mergeRepeated(arr, isRepeatFn, mergeFn) {
  const result = [];
  let j = 0;
  for (let i = 0; i < arr.length; ) {
    let current = arr[i];
    // identify all the following ones that have the same code and merge left-2-right
    for (j = i + 1; j < arr.length; j += 1) {
      const next = arr[j];
      if (isRepeatFn(current, next)) {
        current = mergeFn(current, next);
      } else {
        break;
      }
    }
    result.push(current);
    i = j;
  }
  return result;
}

const sortByName = arr => arr.sort((a, b) => a.name.localeCompare(b.name));

/**
 * Given a sorted array of objects with a `name` property (sorted by name)
 * will drop any repeats it has found in the previous position.
 * @param {*} arr
 */
const removeAdjacentRepeatsComparingName = arr =>
  mergeRepeated(
    arr,
    (a, b) => a.name === b.name,
    (a, b) => a
  );

/**
 * Given an array of objects with a `<prop>` property (not necessarily sorted)
 * will drop any repeats it has already seen while scanning left to right.
 * @param {*} arr
 */
function removeRepeatsComparingProp(arr, prop) {
  let result = [...arr];
  const seen = {};
  result.forEach((r, idx, resultArr) => {
    if (seen[r[prop]]) {
      resultArr[idx] = null;
    } else {
      seen[r[prop]] = true;
    }
  });
  result = result.filter(r => r !== null);
  return result;
}

function removeRepeatsComparingName(arr) {
  return removeRepeatsComparingProp(arr, 'name');
}

function removeRepeatsComparingId(arr) {
  return removeRepeatsComparingProp(arr, 'recipeId');
}

export {
  containsNone,
  indexArrayToObj,
  hasItems,
  groupByPropertyValue,
  removeRepeated,
  bubbleUp,
  bubbleDown,
  indexPositions,
  byOrder,
  isLastIndex,
  mergeRepeated,
  sortByName,
  removeAdjacentRepeatsComparingName,
  removeRepeatsComparingName,
  removeRepeatsComparingId,
  removeRepeatsComparingProp
};
