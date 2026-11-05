/**
 * Given a url with a fragment extracts an id_token from it.
 * This is the url used as a redirect from AWS after a successful login.
 * Sample url:
 * exp://192.168.1.177:19000#id_token=eyJraWQiOiJr...36Ss1qw&access_token=eyJraWQiOi...RLqYJg&expires_in=3600&token_type=Bearer
 * @param {String} url
 */
function extractTokenInfoFromURLFragment(url) {
  const result = {};
  let fragment = '';
  let hash = url.indexOf('#');
  if (hash >= 0) {
    fragment = url.substring(hash + 1);
    let components = fragment.split('&');
    components.forEach(c => {
      const [prop, val] = c.split('=');
      result[prop] = val;
    });
  }
  return result;
}

export { extractTokenInfoFromURLFragment };
