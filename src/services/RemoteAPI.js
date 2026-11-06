// GetOutletMenuPlans is the endpoint that returns the recipes.
// The endpoint expects a POST request and we need to pass it
// the list of outlets and respective menu plans we are interested in.
import axios from 'axios';
import { outletMenuPlans, tokenRegistration } from '../../config/urls';
import { prepareRequestHeaders } from '../utils/object-utils';
import Logger from './Logger';
import buildK from '../utils/request-utils';

const logger = Logger.getLogger();

/**
 * Given an object with the selected outlets and menus,
 * builds up a slightly different structure but same information
 * to be sent to the getoutletmenuplans endpoint
 *
 * TODO: needs tests. easy to do.
 *
 * @param {Array} outletData
 * @returns {Object}
 */
export function buildOutletMenuPlansRequestBody(outletData) {
  // Do not pass empty menu_plans to the request
  const outlets = outletData.filter(outlet => outlet.menus && outlet.menus.length > 0).map(outlet => {
    const menuPlans = (outlet.menus || []).map(menu => menu.menuId);
    return {
      id: outlet.outletId,
      menu_plans: menuPlans
    };
  });
  return { outlets };
}

/**
 * Calls getoutletmenuplans
 * Returns promise
 * @param {Array} outletData Array of outlets. Each entry has a .menu(array) and a .outletId(string).
 * Each entry on .menu has .menuId(string)
 */
export async function getOutletMenuPlans(outletData, authToken) {
  const service = outletMenuPlans;
  const requestBody = buildOutletMenuPlansRequestBody(outletData);
  const { url } = service;
  const headers = prepareRequestHeaders(
    {
      Authorization: authToken,
      'content-type': 'application/json'
      // 'x-api-key': key
    },
    buildK()
  );

  logger.traceRequest(url, 'POST', null, requestBody /* ,headers */);
  return axios({
    method: 'POST',
    url,
    headers,
    data: requestBody
  });
}

/**
 * Records in the server that the given push notification token
 * is interested in the given outletIds
 * @param {*} token
 * @param {*} outletIds
 */
export async function registerPushTokenForOutletIds(
  token,
  outletIds,
  authToken
) {
  const service = tokenRegistration;
  const requestBody = {
    action: 'register',
    token,
    outlets: outletIds
  };
  const { url } = service;
  const key = buildK();
  const headers = prepareRequestHeaders(
    {
      'content-type': 'application/json',
      // 'x-api-key': key,
      [`Authorization`]: authToken,
      [`test-push-token`]: token
    },
    key
  );
  logger.traceRequest(url, 'POST', key, requestBody);

  try {
    return axios({
      method: 'POST',
      url,
      headers,
      data: requestBody
    });
  } catch (error) {
    logger.traceRequest(url, 'POST error', error);
  }
}
