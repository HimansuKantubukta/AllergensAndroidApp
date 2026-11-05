const assert = require('assert');
const {
  extractTokenInfoFromURLFragment
} = require('../../src/utils/auth-utils');

test('extractTokenInfoFromURLFragment', function() {
  // given the following data:
  const url =
    'exp://192.168.1.177:19000#id_token=eyJraWQiOiJr...36Ss1qw&access_token=eyJraWQiOi...RLqYJg&expires_in=3600&token_type=Bearer';

  assert.deepStrictEqual(
    extractTokenInfoFromURLFragment(url),
    // we should get back this:
    {
      id_token: 'eyJraWQiOiJr...36Ss1qw',
      access_token: 'eyJraWQiOi...RLqYJg',
      expires_in: '3600',
      token_type: 'Bearer'
    }
  );
});
