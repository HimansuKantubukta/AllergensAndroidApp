/**
 * Splits the given str string into a left and right part.
 * Returns object with left and right properties.
 * @param {String} str string to split
 * @param {String} splitter string to break on
 */
function stringSplit(str, splitter) {
  const idx = str.indexOf(splitter);
  if (idx !== -1) {
    return { left: str.substring(0, idx), right: str.substring(idx + 3) };
  }
  return { left: str, right: '' };
}

export { stringSplit };
