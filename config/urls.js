import Constants from 'expo-constants';
import Logger from '../src/services/Logger';

const logger = Logger.getLogger();

if (!Constants.manifest.extra) {
  console.log(
    'Missing environment so I do not know which backend to call. Dev/UAT/Prod?'
  );
  throw new Error(
    'Please run with --config=config/app-dev.json (or -uat or -prod). Or just call npm run-script start:dev'
  );
}

const debug = false;
const trace = function trace(s) {
  return debug ? console.log(s) : null;
};

// Login urls - AWS Hosted UI
const awsHostedBase = Constants.manifest.extra.login.base; // e.g. `https://keytree-dev.auth.eu-west-1.amazoncognito.com`;
const awsClientId = Constants.manifest.extra.login.clientId; // e.g. '5kkuang*****s9c3paf8vsf68bs';
const awsHostedLoginParams = `client_id=${awsClientId}&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile`;
const awsHostedLoginURL = `${awsHostedBase}/login?`;

/**
 * Returns the url for the login page (AWS Hosted UI)
 *
 * NOTE: On the built app, the redirectUri is 'allergens://exp.host/@talmeida/compass-compassallergens'.
 * This needs to match _exactly_ the callback URL defined in AWS > cognito > (User pool) > App client settings
 * or the login page will fail to load.
 * When running in development through expo, the value is usually: exp://192.168.1.177:19000
 *
 * @param {String} redirectURI The url to redirect to after successful login.
 * This depends on if you're running standalone app or in expo preview.
 * Use Linking.makeUrl() to get it.
 */
function AWSHostedUILoginURL(redirectURI) {
  const res = `${awsHostedLoginURL}${awsHostedLoginParams}&redirect_uri=${redirectURI}`;
  trace(`LoginURL=${res}`);
  return res;
}

/**
 * Returns the URL to open in the browser to
 * kickstart the logout process.
 * @param {String} redirectURI The final url to redirect to.
 *    Usually something like 'allergens:///loggedout'
 */
function AWSHostedUILogoutURL(redirectURI) {
  const landingPage = Constants.manifest.extra.login.landingLogout;
  let result = AWSHostedUILoginURL(redirectURI);
  result = result.replace('login', 'logout');
  result = `${result}&logout_uri=${landingPage}/A1/logout?redirect_uri=${redirectURI}`;
  // Sample URL to return:
  // https://compass-dev.auth.eu-west-1.amazoncognito.com/logout?client_id=1...k&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=allergens:///loggedin&logout_uri=https://dev-landing.compassconnect.com/A1/logout?redirect_uri=allergens:///loggedout
  logger.trace('urls', `LogoutURL= ${result}`);
  return result;
}

// define these constants in config/app-xxx.json under the extra node.

module.exports = {
  // List of menu plans per outlet
  menuPlansURL: {
    url: Constants.manifest.extra.backendURL.menuPlansURL.url
  },
  // List of outlets
  outletsURL: {
    url: Constants.manifest.extra.backendURL.outletsURL.url
  },
  // list of menu plans/dayparts/recipes for the requested outlet+menuplans
  outletMenuPlans: {
    url: Constants.manifest.extra.backendURL.outletMenuPlans.url
  },
  // Register token for push notifications
  tokenRegistration: {
    url: Constants.manifest.extra.backendURL.tokenRegistration.url
  },
  AWSHostedUILoginURL,
  AWSHostedUILogoutURL
};
