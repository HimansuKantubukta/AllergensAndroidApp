import { Outlet } from '../../domain/Outlet';
import { assertIsNotEmptyArray, assertObject } from '../../utils/assertions';
import Logger from '../Logger';

const logger = Logger.getLogger();

/**
 * Represents the response from the
 * `getoutletmenuplans` endpoint.
 * Includes the following fields:
 *
 * valid (bool)
 * error (String|Obj)
 * outlets (Array)
 */
export class GetOutletMenuPlansServerResponse {
  constructor(outlets = []) {
    this.outlets = outlets;
    this.valid = true;
  }

  static clone(anotherInstance) {
    const newOne = GetOutletMenuPlansServerResponse.invalidServerResponse();
    newOne.outlets = anotherInstance.outlets.map(o => Outlet.clone(o));
    newOne.valid = anotherInstance.valid;
    newOne.error = anotherInstance.error;
    return newOne;
  }

  // Creates a new instance of GetOutletMenuPlansServerResponse in invalid state
  static invalidServerResponse(error) {
    const serverResp = new GetOutletMenuPlansServerResponse();
    serverResp.valid = false;
    serverResp.error = error;
    return serverResp;
  }

  /**
   * Creates an instance initialized by the array returned by the server
   * @param {Array} serverResponseArr
   */
  static createFromObj(serverResponseArr) {
    console.assert(Array.isArray(serverResponseArr));
    const outlets = serverResponseArr.map(item =>
      Outlet.createFromServerResponse(item)
    );
    return new GetOutletMenuPlansServerResponse(outlets);
  }

  /**
   * Creates an instance initialized by the json returned by the server
   * @param {String} serverResponseJSON
   */
  static createFromJSON(serverResponseJSON) {
    try {
      const parsedObj = JSON.parse(serverResponseJSON);
      return GetOutletMenuPlansServerResponse.createFromObj(parsedObj);
    } catch (error) {
      return GetOutletMenuPlansServerResponse.invalidServerResponse();
    }
  }

  /**
   * Creates an instance from an axios response object straight into the endpoint.
   * @param {AxiosResponseObject} axiosResponse
   */
  static createFromServerResponse(axiosResponse) {
    if (axiosResponse.status < 400 && axiosResponse.data) {
      return GetOutletMenuPlansServerResponse.createFromObj(axiosResponse.data);
    }
    return GetOutletMenuPlansServerResponse.invalidServerResponse(
      axiosResponse.statusText
    );
  }

  getOutlet(outletId) {
    assertIsNotEmptyArray(this.outlets);
    const outlet = this.outlets.find(o => o.id === outletId);
    assertObject(outlet, "outlet is not an object");
    return outlet;
  }

  getFirstOutlet() {
    return this.outlets.length > 0 && this.outlets[0];
  }
}
