// async function loginWithOpenBrowserAsync() {
//   console.log(
//     `loginWithOpenBrowserAsync: setting redirect to:${redirectUri}`
//   );
//   Linking.addEventListener('url', handleRedirect);
//   const result = await WebBrowser.openBrowserAsync(url, {
//     enableBarCollapsing: true
//   });
//   console.log(`openBrowserAsync returned: ${JSON.stringify(result)}`);
// }

// /**
//  */
// async function loginWithAuthSessionModule() {
//   let result = await AuthSession.startAsync({
//     authUrl: url
//   });

//   if (result.type === 'success') {
//     console.log(`loginWithAuthSessionModule: successful login.`);
//   } else if (
//     result.type === 'dismiss' ||
//     (result.type === 'error' && result.errorCode === 'login-declined')
//   ) {
//     // FIXME: alert never pops without delay here, despite the if correctly evaluating true
//     // Any way to check if the window has closed, if that's the issue?
//     await new Promise(resolve => setTimeout(resolve, 5000));
//     console.log(`loginWithAuthSessionModule: result.type=${result.type}`);
//   }
// }

// /**
//  * ====================================================
//  */
// async function loginWithAuthSessionAsync() {
//   try {
//     console.log(`Opening auth session to: ${url}`);
//     // Linking.addEventListener('url', handleRedirect);
//     const openBrowserResult = await WebBrowser.openAuthSessionAsync(
//       url,
//       redirectUri
//     );
//     console.log(`openBrowserResult: ${JSON.stringify(openBrowserResult)}`);
//     let redirectData;
//     if (openBrowserResult.url) {
//       redirectData = Linking.parse(openBrowserResult.url);
//       console.log(`redirectData: ${JSON.stringify(redirectData)}`);
//     } else {
//       console.log(`No url in openBrowserResult.`);
//     }
//     setResult({ openBrowserResult, redirectData });
//   } catch (error) {
//     console.log(error);
//   }
// }

// const keytreeURL = 'https://3nou9rhjf6.execute-api.eu-west-1.amazonaws.com';
// <<<<<<< HEAD
//     url: `${serverURL}/dev/menuplanlist/%outletId`,
//     key: 'KVQTFAteKO4YK5EkeEs6YabsVplFEgCjaqXRGTfn'
//     // requires a JWT token on the Authorization http header
//   },

//   // List of outlets for user
//   outletsURL: {
//     url: `${serverURL}/dev/tradingOutlet/%userId`,
//     key: 'KVQTFAteKO4YK5EkeEs6YabsVplFEgCjaqXRGTfn'
//     // requires a JWT token on the Authorization http header
//   },

//   outletMenuPlans: {
//     url: `${serverURL}/dev/getoutletmenuplans`,
//     key: 'KVQTFAteKO4YK5EkeEs6YabsVplFEgCjaqXRGTfn'
//     // requires a JWT token on the Authorization http header
//   },

//   tokenRegistration: {
//     url: `${serverURL}/dev/registerdevice`,
//     key: 'KVQTFAteKO4YK5EkeEs6YabsVplFEgCjaqXRGTfn'
//     // requires a JWT token on the Authorization http header
//   },

// =======
// <<<<<<< HEAD
// /* eslint-disable func-names */
// //
// // Change this file to configure the URLS called by the application.
// //

// Logout urls
// const awsHostedLogoutURL = `${awsHostedBase}/logout?client_id=${awsClientId}&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile`; // also needs redirect_uri, see AWSHostedUILogoutURL
// const awsHostedLogoutURL = `${awsHostedBase}/oauth2/logout?client_id=${awsClientId}`;

/**
 * ====================================================
 */
function handleRedirect(event) {
  console.log(`handleRedirect called. URL: ${event.url}`);
  const tokens = extractTokenInfoFromURLFragment(event.url);
  setAuthCodeAndRedirect(tokens);
  // const data = Linking.parse(event.url);
  // console.log(`data: ${JSON.stringify(data)}`);
  // const authCode =
  //  (data && data.queryParams && data.queryParams.code) || null;
}

/**
 * 
 * @param {Object} serviceAxiosResponse axios response object
 * 
 * Response is an array of outlets.
 * 
 * Each outlet has:
 *  `outlet`(string)
 *  `menu_plans`(array)
 *  `date`(string e.g. "2012-04-23T00:00:00.000Z")
 * 
 * Each menu plan has:
 *  `id`
 *  `ReqDate`(array)
 * 
 * Each item in the ReqDate has:
 *  `requiredDate`(string)
 *  `dayPart`(array)
 * 
 * This means that we have different daypart arrays over time,
 * depending on the requiredDate.
 * 
 * Each dayPart has:
 *  `dayPartCode`(string)
 *  `course`(array)
 * 
 * Each course has 
 *  `courseCode`()
 *  `item`(array)
 * 
 * Each item has the following fields:
 *  "recipeId": "1",
    "itemNo": null,
    "itemPosition": null, 
    "UOM": null,
    "name": "My recipe 1",
    "contains": [
        "eggs"
    ],
    "may_contain": [
        "milk",
        "seseme"
    ],
    "actualProduced": "1",
    "actualSales": "10",
    "bundle": null,
    "currency": "GBP",
    "fatCode": "H",
    "ind": null,
    "locPriceAllowed": "N",
    "locPriceExist": "N",
    "longName": "CPUH TOMATO & BASIL SAUCE (QF 37A)",
    "noAllergens": "N",
    "priceList": "SE",
    "prodHier": "Z0001002",
    "saltCode": null,
    "saturatesCode": null,
    "tillDesc": "TOM BASIL SCE",
    "yieldAllowed": "N",
    "yieldExists": "N",
    "costPrice": 0.94,
    "freeItem": 0,
    "ptnNo": 10,
    "sellingPrice": 0,
    "staffFeed": 0,
    "stdCostPrice": 0.26,
    "stdPtnNo": 1000,
    "stdSellingPrice": 0,
    "targetQty": 1,
    "type": 1,
    "vatRate": 0.2,
    "wastage": 0

 * this is the outline object:
 *  outlet
 *  date
 *  menu_plans[]
 *   id
 *   ReqDate
 *     requiredDate
 *     dayPart
 *       dayPartCode
 *       course[]
 *         courseCode
 *         item[]
 *           ...
 *          
 *       
 * 
 * @returns an object with
 * {
 *      ok: boolean,
 *      firstOutlet: outlet
 *      outlets: array of outlets
 * }
 */
// export function flattenOutletMenuPlans(serviceAxiosResponse) {
//   const parsed = {};
//   const isOk =
//     serviceAxiosResponse.data &&
//     Array.isArray(serviceAxiosResponse.data) &&
//     serviceAxiosResponse.data.length > 0;
//   parsed.ok = serviceAxiosResponse.data;

//   const parseMenuPlans = menuPlansArr =>
//     menuPlansArr.map(m => {
//       return {
//         id: m.id,
//         dayParts: parseDayParts(m.dayPart)
//       };
//     });

//   const parseOutlets = outletsData =>
//     outletsData.map(o => {
//       return {
//         id: o.outlet,
//         menuPlans: parseMenuPlans(o.menu_plans)
//       };
//     });

//   if (isOk) {
//     parsed.firstOutlet = serviceResponse.data[0];
//     parsed.outlets = parseOutlets(serviceResponse.data);
//   }
//   return parsed;
// }

// console.log(
//   `setSelectedOutlets called: ${JSON.stringify(selectedOutlets)}`
// );
// const stack = new Error().stack;
// console.log(stack);

// console.log(
//   `DayChangeListener:recipesContext: ${JSON.stringify(recipesContext)}`
// );

// const handleDayChange = function() {
//   const recipesContext = recipesContextRef.current;
//   console.log(
//     `DayChangeListener:recipesContext:handleDayChange: ${JSON.stringify(
//       recipesContext
//     )}`
//   );
//   const nowMs = new Date().getTime();
//   if (nowMs > recipesContext.currentDay.getTime()) {
//     console.log(`Day has changed!`);
//     // Theoretically we need to re-read the cached server response and parse it again.
//     // because we're parsing again we'll pick up the data valid today.
//     // In practice, we can simply simulate an outlet change, which does all that.
//     const currentOutletId =
//       menuContext && menuContext.data && menuContext.data.outlet;
//     const mergeMenuPlans =
//       adminContext.outletSettings[currentOutletId] &&
//       adminContext.outletSettings[currentOutletId].merged;
//     const { selectedMenuPlans } = adminContext;
//     onOutletChanged(
//       currentOutletId,
//       refresherService,
//       mergeMenuPlans,
//       selectedMenuPlans,
//       recipesContext
//     ).then(() => {
//       recipesContext.setCurrentDay(new Date());
//       console.log(`Day has changed! - Done`);
//     });
//   }
// };

// const scheduleUpdateAtMidnight = function() {
//   // calculate the difference between now
//   // and midnight. Run a function once
//   // midnight reaches so we can update
//   // the recipes.
//   const midnightMs = tomorrow00h().getTime();
//   const nowMs = new Date().getTime();
//   let msTillMidnight = midnightMs - nowMs;
//   console.log(`msTillMidnight=${msTillMidnight}`);
//   msTillMidnight = 10000; // debug TODO
//   setTimeout(() => handleDayChange(), msTillMidnight);
// };

// useEffect(() => {
//   console.log(
//     `DayChangeListener:useEffect: ${JSON.stringify(recipesContext)}`
//   );
//   scheduleUpdateAtMidnight();
// }, []);

// import { sortBy } from 'lodash';
// sortBy(this.courses, c => c.courseCode)

// They now need to be sorted by dayPartCode using a stable sort.
// dayParts = sortBy(dayParts, d => d.dayPartCode);
