/* eslint-disable no-shadow */
/* eslint-disable func-names */
import { useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { getDate } from 'date-fns';
import RecipesContext from '../../context/RecipesContext';
import AdminContext from '../../context/AdminContext';
import MenuContext from '../../context/MenuContext';
import { tomorrow00h } from '../../utils/date-utils';
import DeviceStorage from '../../services/DeviceStorage';
import DataRefresher from '../../services/DataRefresher';
import Logger from '../../services/Logger';
import { onOutletChanged } from '../outletSelector';
import { useInterval } from '../../utils/hooks';
import { timefromHours } from '../../utils/date-utils';
import { manualRefreshHour } from '../../../config/parameters';

const logger = Logger.getLogger();

/**
 * This is a logic component (no display) used to force a
 * rerender whenever the day changes.
 */
export default function DayChangeListener({ children }) {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const recipesContext = useContext(RecipesContext);
  const adminContext = useContext(AdminContext);
  const menuContext = useContext(MenuContext);
  const [deviceStorageOutlets, setDeviceStorageOutlets] = useState([]);
  // const recipesContextRef = useRef();
  // recipesContextRef.current = recipesContext;
  const refresherService = new DataRefresher(
    adminContext,
    menuContext,
    recipesContext,
    DeviceStorage,
    logger
  );

  // calculate how long till day changes. Note it may have changed already!
  const midnightMs = tomorrow00h(recipesContext.currentDay).getTime();
  const nowMs = new Date().getTime();
  const msTillMidnight = midnightMs - nowMs + 1000;
  // console.log(`Milliseconds until day changes: ${msTillMidnight}ms`);
  // msTillMidnight = 10000; // uncomment to debug

  const handleAppStateChange = nextAppState => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  const clearMenuPlanDeviceData = () => {
    const now = new Date();

    refresherService.clearMenuPlanDeviceData(
      recipesContext,
      adminContext,
      menuContext
    );

    // To allow the DateChangeListener condition to stop running until new menus are added
    recipesContext.setRecipeSaveDay(now);
  };

  // We need to listen to the app state change as the timer may not run if the app is in background.
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useInterval(async () => {
    const now = new Date();

    // now.setDate(now.getDate() + 1)
    // now.setHours(1)

    const nowDate = getDate(now);

    // if the current day is != to when we saved the recipes i.e. the next day - then clear the data
    if (nowDate !== getDate(recipesContext.recipeSaveDay)) {

      if (getDate(recipesContext.currentDay) !== nowDate) {
        recipesContext.setCurrentDay(now);
        recipesContext.setOutletSelectionDate(now);
      }


        const outletsWithManualRefresh = recipesContext.outletsWithManualRefresh;

      // If outlets with manual refresh, keep the data until 6am - then clear, otherwise clear all the data
      if (outletsWithManualRefresh) {
        const todayTime = now.getTime();
        const manualRefreshTime = timefromHours(manualRefreshHour, now);
        if (todayTime >= manualRefreshTime) {
          clearMenuPlanDeviceData();
        }
      } else if (adminContext.selectedOutlets) {
        clearMenuPlanDeviceData();
      }

      // removed old logic where we were applying data each day from device storage - now users have to select and load data each day
      //   // Theoretically we need to re-read the cached server response and parse it again.
      //   // because we're parsing again we'll pick up the data valid today.
      //   // In practice, we can simply simulate an outlet change, which does all that.
      //   const currentOutletId =
      //     menuContext && menuContext.data && menuContext.data.outlet;
      //   const mergeMenuPlans =
      //     adminContext.outletSettings[currentOutletId] &&
      //     adminContext.outletSettings[currentOutletId].merged;
      //   const { selectedMenuPlans } = adminContext;
      //   onOutletChanged(
      //     currentOutletId,
      //     refresherService,
      //     mergeMenuPlans,
      //     selectedMenuPlans,
      //     recipesContext
      //   ).then(() => {
      //     recipesContext.setCurrentDay(new Date());
      //   });
    }
    // }, Math.max(msTillMidnight, 0));
  }, Math.max(1, 0));

  return children;
}
