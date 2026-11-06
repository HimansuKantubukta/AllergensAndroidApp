/**
 * Returns the corresponding symbol for a specific currency code
 * @param {String} currencyCode 3 letter code for currency in upper case
 */
function currencySymbol(currencyCode) {
  const symbol = { GBP: '£', EUR: '€', USD: '$' };
  return symbol[currencyCode] || '';
}

/**
 * Formats a currency and amount. Some currencies the symbol is on the right,
 * others on the left.
 * @param {Any} amount amount
 * @param {*} currencyCode 3 letter code for currency in upper case
 */
function formatAmount(amount, currencyCode) {
  if (currencyCode === 'EUR') {
    return `${amount} ${currencySymbol(currencyCode)}`;
  }
  return `${currencySymbol(currencyCode)} ${amount}`;
}

export { formatAmount, currencySymbol };
