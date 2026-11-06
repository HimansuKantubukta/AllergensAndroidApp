import { isKeyDateWithinPeriod } from '../../src/utils/date-utils';

const assert = require('assert');

test('isKeyDateWithinPeriod', function() {
  const today = new Date();
  today.setFullYear(2020, 11, 15);

  const notWithin = isKeyDateWithinPeriod(
    today,
    '2020-12-01T00:00:00.000Z',
    '2020-12-10T00:00:00.000Z'
  );

  assert.strictEqual(notWithin, false);

  const within = isKeyDateWithinPeriod(
    today,
    '2020-12-10T00:00:00.000Z',
    '2020-12-20T00:00:00.000Z'
  );

  assert.strictEqual(within, true);
});
