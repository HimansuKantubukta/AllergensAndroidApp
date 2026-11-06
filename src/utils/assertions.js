export function assertIsArray(thing) {
  const isArr = Array.isArray(thing);
  console.assert(isArr);
  return true;
}

export function assertIsNotEmptyArray(arr) {
  const ok = Array.isArray(arr) && arr.length > 0;
  console.assert(ok);
  return ok;
}

export function assertObject(obj, message) {
  const ok = obj !== null && obj !== undefined;
  console.assert(ok, message);
  return ok;
}
