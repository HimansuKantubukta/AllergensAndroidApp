/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
/* eslint-disable global-require */
import 'react-native-gesture-handler';
import React from 'react';
import * as Font from 'expo-font';
import { registerCustomIconType } from 'react-native-elements';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

registerCustomIconType('material-community', MaterialCommunityIcons);
registerCustomIconType('material', MaterialIcons);
registerCustomIconType('font-awesome', FontAwesome);
import { StatusBar, SafeAreaView, StyleSheet, LogBox } from 'react-native';
import _ from 'lodash';
import { NavigationContainer } from '@react-navigation/native';
import { setCustomText } from 'react-native-global-props';
import { enableScreens } from 'react-native-screens';
import MenuContext, {
  validateFlatOutlet as menuContextValidateFlatOutlet
} from './src/context/MenuContext';
import Navigation from './src/components/navigation';
import { navigationRef } from './src/components/navigation/navigationHelper';
import RecipesContext from './src/context/RecipesContext';
import AdminContext from './src/context/AdminContext';
import { setupNotifications } from './src/services/Notifications';
import DeviceStorage from './src/services/DeviceStorage';
import Logger from './src/services/Logger';
import theme from './src/styles/theme.style';
import PushNotificationHandler from './src/components/pushNotificationHandler';
import { flatOutletWithoutExpiredMenuPlans } from './src/domain/flatOutlet';
import DayChangeListener from './src/components/DayChangeListener';
import { manualRefreshHour } from './config/parameters';
import { dateYesterday, timefromHours, timeMidnight } from './src/utils/date-utils';
import { getDate } from 'date-fns';

const logger = Logger.getLogger();

LogBox.ignoreLogs(['Setting a timer']);




// Configure screens
enableScreens();

// Configure Expo notification framework
setupNotifications();

function initializeAppState(initialOutletData) {
  return {
    data: initialOutletData,
    visibleRecipes: initialOutletData.recipes,
    allRecipes: initialOutletData.recipes,
    allergens: [],
    possibleAllergens: [],
    excludeGFCereals: false,
    selectedMenuPlanIds: [],
    fontLoaded: false,
    visibleDayParts: [],
    searchQueryFilter: '',
    selectedOutlets: [],
    selectedMenuPlans: [],
    userId: false,
    slowTradingOutletsRequest: false,
    // notifications state
    notification: null,
    pushToken: null, // Push notification device token
    logMessages: [], // Debug messages
    outletNameOverrides: {}, // map with id -> name. Allows user to specify custom name for an outlet.
    outletSettings: {},
    currentDay: new Date(),
    recipeSaveDay: {},
    outletsWithManualRefresh: false,
    outletSelectionDate: new Date(),
    manualRefreshTime: new Date()
  };
}

function loadFonts() {
  return Font.loadAsync({
    // eslint-disable-next-line import/no-dynamic-require
    'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf'),
    'nunito-extra-bold': require('./assets/fonts/Nunito-ExtraBold.ttf'),
    'nunito-medium': require('./assets/fonts/Nunito-Regular.ttf'),
    'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
    'nunito-light': require('./assets/fonts/Nunito-Light.ttf'),
    ...MaterialCommunityIcons.font,
    ...MaterialIcons.font,
    ...FontAwesome.font
  });
}

export default class App extends React.Component {
  // FIXME
  // static contextType = AdminContext; // with this contextType
  // then we can do this.context in an instance.


  

  constructor() {
    super();
    const initialOutletData = {
      menu_plans: [],
      recipes: [],
      day_parts: []
    };
    this.state = initializeAppState(initialOutletData);
  }

  async componentDidMount() {
    StatusBar.setHidden(true);
    await loadFonts();
    logger.setInsertFn(this.insertLogMessage.bind(this));
    await this.readRecipeSaveDate();
    await this.readOutletsWithManualRefresh();
    await this.readSelectedMenuPlans();
    await this.readOutletFromDeviceStorage();
    await this.readOutletNameOverridesFromDeviceStorage();
    await this.readPerOutletSettingsFromDeviceStorage();
    
    this.insertLogMessage(`Application started.`);
  }

  

  setData(newData) {
    this.setState({ data: newData });
  }

  setVisibleRecipes(newRecipes) {
    this.setState({ visibleRecipes: newRecipes });
  }

  setCurrentDay(newDate) {
    // update the recipes whenever the day changes.
    console.log(`App: updating recipes cause day changed`);
    this.setState({ currentDay: newDate });
  }

  setRecipeSaveDay(newDate) {
    // to comapare when recipes loaded to current day when tablet is switched on from scratch.
    console.log(`App: updating recipes load day`);
    this.setState({ recipeSaveDay: newDate });
  }

  setOutletsWithManualRefresh(manualRefresh) {
    // if there are outlets with manual refresh we don't clear data until certain time after midnight
    console.log(`App: updating outlets with manual refresh`);
    this.setState({ outletsWithManualRefresh: manualRefresh });
  }

  setOutletSelectionDate(now) {
    const outletsWithManualRefresh = this.state.outletsWithManualRefresh;
    const today = new Date(now);
    const todayTime = today.getTime();
    const manualRefreshTime = timefromHours(manualRefreshHour, now);
    const midnightTime = timeMidnight(now)

    const recipeSaveDay = this.state.recipeSaveDay;
    const dayDate = now.getDate();
    const dayRecipeSaved = recipeSaveDay.getDate();

    let date =
      outletsWithManualRefresh && todayTime >= midnightTime && todayTime <= manualRefreshTime
        ? dateYesterday(today) : today;

    if (dayDate === dayRecipeSaved) {
      date = recipeSaveDay;
    }


    // console.log("setOutletSelectionDate", date)
    this.setState({ outletSelectionDate: date });
    // console.log("setOutletSelectionDateState", this.state)
  }

  setOutletSelectionDateToday(now) {
    this.setState({ outletSelectionDate: new Date() });
  }

  setAllergens(newAllergens) {
    this.setState({ allergens: newAllergens });
  }

  setPossibleAllergens(newAllergens) {
    this.setState({ possibleAllergens: newAllergens });
  }

  setExcludeGFCereals(value) {
    this.setState({ excludeGFCereals: value });
  }

  setSelectedMenuPlanIds(menuPlans) {
    this.setState({ selectedMenuPlanIds: menuPlans });
  }

  setVisibleDayParts(dayParts) {
    this.setState({ visibleDayParts: dayParts });
  }

  setSearchQueryFilter(searchQueryFilter) {
    this.setState({ searchQueryFilter });
  }

  setSelectedOutlets(selectedOutlets) {
    this.setState({ selectedOutlets });
  }

  setSelectedMenuPlans(selectedMenuPlans) {
    this.setState({ selectedMenuPlans });
  }

  setUserID(userId) {
    this.setState({ userId });
  }

  setPushToken(tk) {
    this.setState({ pushToken: tk });
  }

  setOutletNameOverrides(o) {
    this.setState({ outletNameOverrides: o });
  }

  setOutletSettings(o) {
    this.setState({ outletSettings: o });
  }

  setAuthCode(t) {
    this.setState({ authCode: t });
  }

  setSlowTradingOutletsRequest(b) {
    this.setState({ slowTradingOutletsRequest: b });
  }

  clearRecipeData() {
    this.setState(state => ({
      data: {
        ...state.data,
        menu_plans: [],
        recipes: [],
        day_parts: []
      }
    }));
  }

  clearAllRecipes() {
    this.setState({ allRecipes: [] });
  }

  /**
   * Sets the given flat outlet, recipes and day parts on the state
   * so that they are displayed.
   * @param {Object} flatOutlet A flat outlet object. With `recipes`, `menu_plans`, `day_parts`
   * @param {Array} visibleDayParts Array of the visible dya parts
   * @param {Array} visibleRecipes Array of the visible recipes (after filtering out allergens)
   * @param {Array} allergens Array with the allergens to filter out
   * @param {Array} possibleAllergens Array with the possible allergens to filter out
   */
  setOutletData(
    flatOutlet,
    visibleDayParts,
    visibleRecipes,
    allergens,
    possibleAllergens
  ) {
    const { recipes, menu_plans, day_parts } = flatOutlet;
    this.setState({
      allRecipes: recipes,
      visibleRecipes: visibleRecipes || recipes,
      visibleDayParts: visibleDayParts || day_parts,
      searchQueryFilter: '',
      allergens: allergens || [],
      possibleAllergens: possibleAllergens || [],
      selectedMenuPlanIds: menu_plans.map(m => m.id)
    });
  }

  resetFilters = () => {
    const allMenus = this.state.data.menu_plans
      ? this.state.data.menu_plans.map(mp => mp.id)
      : [];
    this.setState(prevState => {
      return {
        ...prevState,
        visibleRecipes: prevState.data.recipes,
        // allRecipes: prevState.data.recipes,
        searchQueryFilter: '',
        allergens: [],
        possibleAllergens: [],
        excludeGFCereals: false,
        selectedMenuPlanIds: allMenus
      };
    });
  };

  readOutletFromDeviceStorage = async () => {
    const initialOutletData = {
      menu_plans: [],
      recipes: [],
      day_parts: []
    };

    let date = this.state.outletSelectionDate;

    // read the menu plan from device storage:
    let flatOutlet = await DeviceStorage.readFlatOutlet();

    // discard any menu plan (and day parts/recipes) that is now expired
    flatOutlet = flatOutletWithoutExpiredMenuPlans(flatOutlet, date);

    if (flatOutlet) {
      const obj = flatOutlet;
      this.setState({
        data: obj || initialOutletData,
        fontLoaded: true,
        allRecipes: obj ? obj.recipes : [],
        visibleRecipes: obj ? obj.recipes : [],
        visibleDayParts: obj ? obj.day_parts : []
      });
      () => this.defaultFonts();
    } else {
      this.setState({
        fontLoaded: true
      });
      () => this.defaultFonts();
    }
  };

  readOutletNameOverridesFromDeviceStorage = async () => {
    try {
      const nameOverrides = await DeviceStorage.readOutletNameOverrides();
      if (nameOverrides) {
        this.setState({ outletNameOverrides: nameOverrides });
      }
    } catch (error) {
      console.log(
        `Error reading outlet name overrides: ${JSON.stringify(error)}`
      );
    }
  };

  readPerOutletSettingsFromDeviceStorage = async () => {
    try {
      const outletSettings = await DeviceStorage.readPerOutletSettings();
      if (outletSettings) {
        this.setState({ outletSettings });
      }
    } catch (error) {
      console.log(
        `Error reading per outlet settings: ${JSON.stringify(error)}`
      );
    }
  };

  readSelectedMenuPlans = async () => {
    try {
      const selectedMenuPlans = await DeviceStorage.readSelectedMenuPlans();
      if (selectedMenuPlans) {
        this.setSelectedMenuPlans(selectedMenuPlans);
      }
    } catch (error) {
      console.log(`Error reading selectedMenuPlans: ${JSON.stringify(error)}`);
    }
  };

  readRecipeSaveDate = async () => {
    try {
      const oRecipeSaveDate = await DeviceStorage.readRecipeSaveDay();
      if (oRecipeSaveDate) {
        this.setRecipeSaveDay(oRecipeSaveDate);
      }
    } catch (error) {
      console.log(`Error reading recipe save day: ${JSON.stringify(error)}`);
    }
  };

  readOutletsWithManualRefresh = async () => {
    try {
      const outletsWithManualRefresh = await DeviceStorage.readOutletsWithManualRefresh();

      this.setOutletsWithManualRefresh(outletsWithManualRefresh);

      this.setOutletSelectionDate(new Date());
    } catch (error) {
      console.log(`Error reading outlets with manual refresh: ${JSON.stringify(error)}`);
    }
  };

  insertLogMessage(m) {
    this.setState(prevState => ({
      logMessages: [m, ...prevState.logMessages]
    }));
  }

  /**
   * handleNotification: Called when a notification is received and
   * the app is foregrounded.
   */
  handleNotification(notification) {
    this.setState({ notification });
  }

  /**
   * handleNotificationResponse: Called when the notification is received
   * and the user tabs on the notification.
   */
  // eslint-disable-next-line class-methods-use-this
  handleNotificationResponse(response) {
    console.log(response);
  }

  /**
   * menuContextSetData: sets data in the menu context
   * and validates that what is being put has the
   * expected shape.
   */
  menuContextSetFlatOutlet(flatOutlet) {
    menuContextValidateFlatOutlet(flatOutlet);
    this.setData(flatOutlet);
  }

  defaultFonts() {
    const customTextProps = {
      style: {
        fontFamily: 'nunito-medium'
      }
    };
    setCustomText(customTextProps);
  }

  render() {
    return this.state.fontLoaded ? (
      <MenuContext.Provider
        value={{
          data: this.state.data,
          setFlatOutlet: newData => this.menuContextSetFlatOutlet(newData),
          clearRecipeData: () => this.clearRecipeData()
        }}>
        {/* Recipes context contains the list of recipes that are displayed to the user */}
        <RecipesContext.Provider
          value={{
            allRecipes: this.state.allRecipes, // never changes
            visibleRecipes: this.state.visibleRecipes,
            allergens: this.state.allergens,
            possibleAllergens: this.state.possibleAllergens,
            excludeGFCereals: this.state.excludeGFCereals,
            selectedMenuPlanIds: this.state.selectedMenuPlanIds,
            visibleDayParts: this.state.visibleDayParts,
            searchQueryFilter: this.state.searchQueryFilter,
            currentDay: this.state.currentDay,
            recipeSaveDay: this.state.recipeSaveDay,
            outletsWithManualRefresh: this.state.outletsWithManualRefresh,
            outletSelectionDate: this.state.outletSelectionDate,
            manualRefreshTime: this.state.manualRefreshTime,
            setExcludeGFCereals: value => this.setExcludeGFCereals(value),
            setRecipeSaveDay: d => this.setRecipeSaveDay(d),
            setOutletsWithManualRefresh: d => this.setOutletsWithManualRefresh(d),
            setOutletSelectionDate: d => this.setOutletSelectionDate(d),
            setOutletSelectionDateToday: d => this.setOutletSelectionDateToday(d),
            setCurrentDay: d => this.setCurrentDay(d),
            setVisibleRecipes: r => this.setVisibleRecipes(r),
            setAllergens: a => this.setAllergens(a),
            setPossibleAllergens: a => this.setPossibleAllergens(a),
            setSelectedMenuPlanIds: m => this.setSelectedMenuPlanIds(m),
            setVisibleDayParts: d => this.setVisibleDayParts(d),
            setSearchQueryFilter: r => this.setSearchQueryFilter(r),
            resetFilters: this.resetFilters,
            setOutletData: (...args) => this.setOutletData(...args),
            clearAllRecipes: () => this.clearAllRecipes()
          }}>
          {/* AdminContext contains log messages and the tablet configuration */}
          <AdminContext.Provider
            value={{
              selectedOutlets: this.state.selectedOutlets,
              selectedMenuPlans: this.state.selectedMenuPlans,
              logMessages: this.state.logMessages,
              userId: this.state.userId,
              pushToken: this.state.pushToken,
              outletNameOverrides: this.state.outletNameOverrides,
              outletSettings: this.state.outletSettings,
              authCode: this.state.authCode,
              slowTradingOutletsRequest: this.state.slowTradingOutletsRequest,
              setSelectedOutlets: o => this.setSelectedOutlets(o),
              setSelectedMenuPlans: mp => this.setSelectedMenuPlans(mp),
              setUserID: uId => this.setUserID(uId),
              setPushToken: tk => this.setPushToken(tk),
              insertLogMessage: m => this.insertLogMessage(m),
              setOutletNameOverrides: o => this.setOutletNameOverrides(o),
              setOutletSettings: o => this.setOutletSettings(o),
              setAuthCode: t => this.setAuthCode(t),
              setSlowTradingOutletsRequest: b =>
                this.setSlowTradingOutletsRequest(b)
              // setOutletMenuPlansMerged: o => this.setOutletMenuPlansMerged(o),
              // outletMenuPlansMerged: this.state.outletMenuPlansMerged,
            }}>
            <PushNotificationHandler>
              <DayChangeListener>
                <SafeAreaView style={styles.container}>
                  <NavigationContainer ref={navigationRef}>
                    <Navigation />
                  </NavigationContainer>
                </SafeAreaView>
              </DayChangeListener>
            </PushNotificationHandler>
          </AdminContext.Provider>
        </RecipesContext.Provider>
      </MenuContext.Provider>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background
  }
});
