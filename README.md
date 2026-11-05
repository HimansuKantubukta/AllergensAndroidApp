# Compass allergens applicaton

Hello! Welcome to this codebase.

This is an android tablet app designed to display menus(recipes) and quickly filter them out
based on the user dietary requirements. It is built with React Native (Expo) for Compass Group.

![Home](.\docs\img\Second_outlet_single_menuplan.png)

The recipes are fetched from a remote service when an administrator wants and then stored locally on the tablet.
This means the tablet can work fine without internet connection (except when you're trying to fetch new recipes).

## User Manual

Check `USER_MANUAL.md` for a tour of how the app works with many screenshots.

## Domain

The domain is simple, but there are a few concepts to know by heart:

- Outlet: A canteeen or restaurant. A place that sells food.
- Menu Plan: From a user perspective it is a group of recipes.
- Recipe: A meal, e.g. "Carrot soup" or "Spag bol".
- Day Part: A group of recipes. Actually recipes belong to a day part. Day parts belong to a menu plan. It can be for example "Breakfast" or "Indian food".
- Course: Not visible to a user but recipes are first grouped into courses, then a set of courses belongs to a day part.

## Application design

The app follows the design defined in https://projects.invisionapp.com/d/main/default/#/console/19446915/414543690/preview#project_console
If you need access to that Invision project ask any one of the following:

- Dillon Tank
- Martie Yoshida
- Tiago Almeida
- Satya Turaga
- Rhett Trickett

## Getting started

There is a wiki with a lot of information: https://wiki.keytree.cloud/display/COMAPP/Development%3A+Getting+started

## How to run the application locally

Start the application connected to the `dev` environment:

```
npm run-script start:dev
```

You can also use `uat`. Note the login page will likely fail as the domains do not match. For this to work you need to enter the login token manually. Read below the section "How to run the DEV/UAT/PROD version locally" to know how to do this.

Alternatively you can run the server locally as well.

To run client and server locally:

```
npm run-script start:local
```

and on another terminal, do:

```
npm run-script start:localserver
```

So now you have the app running on the device or the emulator, connected to a server running on your local computer. The local server serves mockdata defined in the `mockserver` folder.

On the localserver, you can add files in `mockserver` folder. In the app, use the "fake login" button to pass the login screen.

Note: Also read below "How to run the DEV/UAT/PROD version locally"

## How to build an application APK

Run this to build for dev. Replace `dev` with `uat` or `prod` to build different versions.

```
npm run-script build:dev
```

When asked for the keystore, use the keystore linked in:

https://wiki.keytree.cloud/display/COMAPP/Development%3A+Getting+started (Section `Build an APK`)

In case of TLS/SSL errors when building i.e. when it attempts to connect to expo via https (this seems to happen on Deloitte Windows machines due SSL certificate blocked from being shared) follow:

Perform steps in document:
https://deloitteus.service-now.com/kb_view.do?sysparm_article=KB0035317

Request via helpdesk to be added to the following AD group that allows bypass of SSL domains that are rated Technology and Cloud infra
- UKR-ALL-Web-Filtering-TechInt-SSL_Bypass

Wait 3 hours for this change to be applied as it's done in the cloud

Team to contact via helpdesk: Endpoint Data Security (Currently rebranding so may change)

Key contact: Amlani, Sanjay
E: samlani@deloitte.co.uk

## Unit Tests

Run tests with the command `npm test`

## How to run the DEV/UAT/PROD version locally

When you fire up the with `npm run-script start:dev` or `npm run-script start:uat` it starts the app on the emulator (or a real android device if it is plugged in by USB) but it is using the DEV or UAT AWS instances. On the login page you will see an error, this is because the login page contains a callback URL which depends on how you're running the app. For a built version of the app it is one thing, for an expo preview it is another. The AWS validates the callback value is what is should be (to prevent redirect hijacking attacks) but this poses a problem in that the normal login flow does not work.

The way to get it around is to open the login page on a browser. Enter the username and password. Then use the developer tools to grab the correct auth token after you press the "Login" button.
With this token you can then hardcode it in the app and the calls will work. This is how you do it:

- On the readme find the login page for dev or for UAT depending on what you'd like. This is below in the "Login URLs" section.
- Open that page on the browser and open the developer tools.
- Enter a valid username and password and press `Login`.
- On the network tools, open the penultimate request (the last one will actually be an error, this is fine)
- The penultimate request is a redirect (302) to a url that starts with `allergens://...`. You'll find this URL in the response headers, in header `location`.
- In this url you need to find what is after `id_token=` and before the following `&`.
- Example: `allergens:///loggedin#access_token=eyJraWQiOiJ4Q3F0VG...HgerweVdWaWWbsjK3REhLIXt4tQcSzckknlZye3OH5PID_kkAEO7XUtMqOPS4nXgXfv_Ah4dbb8EA2Ng-Mb0Jm3Ovijb1uU87m4P94sSHKSu1h-EAqZ6F_FHc0P1AliDcrjRcTkM1qX1NBlF2dkFv446bRE5ZXIgGr85Sv11hVSMVBmmW9zXJowm3Q0kFN37n5U6DPGMUZhl8UNqb0nnQMGt7ZSf8Z37VqEiWzPH7G_k_63EdLvumwKEmkyg5k0G9hD85aeiGPQZx8fEX1gHEMlQ&id_token=eyJraWQiOiJzYWJEcFRSd0VcL2p1M...T8MgoZZV5FbzlvVmHRZzK3Ag&token_type=Bearer&expires_in=3600`
- In the above you'd grab `eyJraWQiOiJzYWJEcFRSd0VcL2p1M...T8MgoZZV5FbzlvVmHRZzK3Ag`
- Set this token in file `AuthTokenPopup` in state variable `token`.
- Example: `const [token, setToken] = useState('eyJraWQiOiJ1TXlSbmVZdFpOY0lEZmZKeHBhcH...`
- Open the app, go to the login section
- Choose button `[Debug] Enter auth token manually`. The token you pasted in the code appears on a popup.
- Press OK in the popup. This will allow you to sidestep the login process.

Note: the token is valid for a few minutes. After that you'd need to refresh it (grab a new one on the login page on the browser)

Note2: Do not commit this token hardcoded in the `authTokenPopup` :-)

## Technical/Functional details

### Important remote services (URLS)

The most important remote service the app calls is `getoutletmenuplans` which returns outlets, menuplans, recipes and courses.
Remote urls are listed in the `urls.js` file.

### Order of the recipes

From Nicola Varney:

Merged Plans:

• The priory order of the plan (which one goes first and then second) defined by UX in administration.
• Then the review of duplicated day parts and their sequenced courses. Taking into consideration the course sort order form each plan.
• Then the cross match of within a Day Part which course goes first from the merged plans in both menu plan priority order and then course sort order.
• Then the sequence of recipes sort order within the courses.
• Then the deduplication at Day Part level of duplicate (PLU identical recipes)

None merged plans:
• The exact stored sort order of day parts
• The exact stored order of courses
• Then the sequence of recipes sort order within the courses
• Then the deduplication at Day Part level of duplicate (PLU identical recipes)

### Login URLs

DEV: https://compass-dev.auth.eu-west-1.amazoncognito.com/login?client_id=1tuak2rtloskaqf293ufuuujhk&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=allergens:///loggedin

UAT: https://compass-uat.auth.eu-west-1.amazoncognito.com/login?client_id=18n8e02apo7f437sph9akviinr&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=allergens:///loggedin

TIP: If you do a login at those urls in the browser you'll see the penultimate request contains a redirect with the
authentication token under `id_token`. You can grab it and put it in the app. (Or put it in `AuthTokenPopup.js` and start the app )

### Differences between DEV and UAT

DEV has autoupdate set to true. This means when you do a build of dev, if only javascript code has changed, then
expo can push the change automatically. Without needing to download and reinstall the apk.
All you need is to close and reopen the app. This is done to speedup development.
You can disable this on `app-dev.json` under `expo.updates.enabled`.

### Note on API-Key

The api key passed to the backend in the `x-api-key` header is required but not sufficient to get access to the backend as it still needs a user session token.
In any case, Compass wanted to obfuscate the Key.

This is done by:

- not having api key on `app-dev.json`, app-uat and app-prd (see ADO-9065)
- introduces an obfuscated function that when executed returns the key. (utils/request-utils.js)
- The function above gets generated when you do start:dev or build:dev (or uat/prod)
- The key is therefore contained in the package.json which doesn't get packaged.

### How is data passed during the admin journey

The admin journey needs to fetch data from the server, merge it with previous selections (stored in the local storage)
and allow the user to cancel all changes without affecting the storage.

On adminHome we call `outletsURL` to fetch a list of outlets.
From there we navigate to `Outlets` or `MenuPlans`. When we navigate to Outlets we pass the list of outlets as a route parameter.
What we pass to this route can be seen in [this file](./mockserver/tradingOutlets/outlets.json)

On `Outlets` ( [Outlets](./src/screens/outlets/index.js) ) we keep a local copy of the outlets list. When we press next,
that local copy is stored in the `AdminContext`: `adminContext.setSelectedOutlets(selectedOutlets);`

### Contexts

Contexts store data that the application keeps in memory.
When a context is written to (via the corresponding setter method) the screen reflects automatically.

The application uses 3 different contexts. Below is a summary of which data they contain.

recipesContext:

- allergens: list of allergens applied/saved
- possibleAllergens: list of may contains allergens applied/saved.

AdminContext:

- selectedOutlets: array of { id, name, unit, currency, hidePrices }. List of outlets.
- selectedMenuPlans: array of ...

MenuContext:

- flatOutlet: the flat representation of the currently selected (visible) outlet.

## FAQ

#### What happens when the app resets due to inactivity?

All the filters are cleared and the app navigates to the "Home" screen. It also logs out of admin if in admin.
This is done in `customHeader:resetHandler`. The timeout is configured in `config\parameters:inactivityTimeoutMs`.

#### What is the difference between the flat and non flat representation of outlet/recipes data?

There are 2 representations of the recipe data used in the app. One is a single object which properties like `outlets`, `menu_plans`, `day_parts`, `recipes`.
Each of these properties is a simple array of objects. There is a hierarchy. One outlet has multiple menu_plans, one menu_plan has multiple day_parts, each day_part has multiple recipes. This hierarchy is represented by having the key of the parent. For example:

```
day_parts: [
    {
      id: '1',
      menu_plan: '5', <- Here we are saying day part 1 belongs to parent menu plan with id '5'
      description: 'Afternoon tea'
    },
...
recipes: [
    {
      id: '1',
      menu_plan: '1',
      day_part: '1', <- this recipe belongs to day_part 1 and menu_plan 1.

```

We call this a flat representation. It is great for certain operations, for example, give me all the recipes regardless of day_part in menu_plan X and Y. This can be done with a simple .filter() over the recipes array.

For other things it can be a pain.

The server has one endpoint to return recipes, menu plans, outlets. It is called `getoutletmenuplans`. It returns essencially the same data but in a nested format.

That endpoint, returns an object that looks like what is in `mockdata\getoutletmenuplans\sampleGetOutletMenuPlan-out.json`.
It is a very nested structure. It also contains the concept of `courses`. A day_part contains `courses`. Each `course` contains `recipes`.

The app never works with this nested representation apart from when it calls the service, where it needs to parse the nested representation,
and convert it to a flat one. This is done in class `src\domain\Outlet`.

##### What happens when an outlet is selected?

We read the device storage and load the result of the last call to `getoutletmenuplans`. This is a response that
contains data about all outlets and all menu plans we care about. We then parse that again using the domain objects.
Once parsed, we convert to a flat structure and set in the context for display. We also set that flat structure
in the device storage so that if we close and open the app it looks the same.

#### How do I quickly run the same code as if a push notification was received?

Navigate to `src\components\PushNotificationHandler\index.js`, search for `TestNotificationButton` and uncomment it.
Pressing that button will perform the same action as if a notification was just received.

### Device storage details

The application reads and writes to the tablet storage using AsyncStorage. AsyncStorage is a key-value
storage type. We use the following keys:

| Key             | Type        | Meaning                                                                                            |
| --------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| outletData      | JSON string | Data about an outlet. Menu plans and recipes. To view a sample structure look in mockdata/menu4.js |
| outletsSettings | JSON string | Selected outlets in the admin                                                                      |
| menusSettings   | "           | Selected menu plans in the admin                                                                   |
"# AllergensAndroidApp" 
