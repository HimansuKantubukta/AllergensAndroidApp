import { GetOutletMenuPlansServerResponse } from './serverResponses/GetOutletMenuPlans';
import { getOutletMenuPlans } from './RemoteAPI';
import Logger from './Logger';
import DeviceStorage from './DeviceStorage';
import { filterRecipes, normalizeAllergen } from '../utils/display';
import { flatOutletWithoutExpiredMenuPlans } from '../domain/flatOutlet';
/**
 * This service knows how to pull outlet + menu plans data
 * from the server into the device storage and app context.
 */

const logger = Logger.getLogger();

export default class DataRefresher {
  /**
   *
   * @param {*} admContext
   * @param {*} menuContext
   * @param {*} recipesContext
   * @param {*} deviceStorage
   */
  constructor(admContext, menuContext, recipesContext, deviceStorage, logger) {
    this.logger = logger;
    this.adminContext = admContext;
    this.menuContext = menuContext;
    this.recipesContext = recipesContext;
    this.deviceStorage = deviceStorage;
  }

  async storeRecipeSaveDay(recipesContext) {
    const oDate = new Date();
    recipesContext.setRecipeSaveDay(oDate);
    return DeviceStorage.writeRecipeSaveDay(oDate);
  }

  async storeOutletsWithManualRefresh(adminContext, recipesContext) {
    const outlets = adminContext.selectedOutlets;
    const outletsWithManualRefresh = outlets.filter(e => e.manualRefresh);
    const isOutletsWithManualRefresh = outletsWithManualRefresh.length > 0;

    recipesContext.setOutletsWithManualRefresh(isOutletsWithManualRefresh);
    recipesContext.setOutletSelectionDateToday();
    return DeviceStorage.writeOutletsWithManualRefresh(isOutletsWithManualRefresh);
  }

  // eslint-disable-next-line class-methods-use-this
  /**
   * Calls the remote endpoint `getoutletmenuplans` for the
   * previously set selected menu plans in the admin context.
   * The response is parsed and the first outlet in it is set
   * as the current outlet. The data is saved in
   * local device storage.
   */
  async refreshOutletMenuPlans(menuContext, recipesContext, adminContext) {
    logger.trace('refreshOutletMenuPlans', `called`);
    let todaysDate = new Date();
    let { selectedMenuPlans, outletSettings } =
      adminContext || this.adminContext;

    if (!selectedMenuPlans || selectedMenuPlans.length === 0) {
      selectedMenuPlans = await DeviceStorage.readSelectedMenuPlans();
    }

    const authToken = adminContext.authCode;

    try {
      // call the remote server to get the recipes details
      const serverResponse = await getOutletMenuPlans(
        selectedMenuPlans,
        authToken
      );

      console.log('================ SERVER RESPONSE ================');
      console.log(JSON.stringify(serverResponse.data, null, 2));
      const ompServerResponse = GetOutletMenuPlansServerResponse.createFromServerResponse(
        serverResponse
      );
      if (ompServerResponse.valid) {
        this.logger.trace('DataRefresh', 'Got valid response from the server');
        // save the server response into device storage, We need it later if we
        // change consumer app to a different outlet.
        this.storeRecipeSaveDay(recipesContext);
        this.storeOutletsWithManualRefresh(adminContext, recipesContext);
        await DeviceStorage.writeOutletMenuPlans(serverResponse.data);
        // Maintain outlets with valid MenuPlans
        const { selectedOutlets } = adminContext;

        // Looping every outlet to check if it has valid menu plans and add a flag hasData to each outlet
        const selectedOutletsValidMenuPlans = selectedOutlets.map(outlet => {
          let currentOutlet = ompServerResponse.getOutlet(outlet.id);
          if (!currentOutlet) {
            console.error(`Outlet ${outlet.id} is not a valid outlet`);
            return false;
          }

          const orderedMenusFromThisOutlet = (
            selectedMenuPlans.find(x => x.outletId === outlet.id) || {
              menus: null
            }
          ).menus;
          const mergeMenuPlans =
            outletSettings[outlet.id] && outletSettings[outlet.id].merged;
          if (mergeMenuPlans) {
            currentOutlet = currentOutlet.mergedMenuPlans(
              orderedMenusFromThisOutlet, todaysDate
            );
            currentOutlet = currentOutlet.flattened(orderedMenusFromThisOutlet, todaysDate);

            return { hasData: Boolean(currentOutlet), ...outlet };
          }
          currentOutlet = currentOutlet.flattened(orderedMenusFromThisOutlet, todaysDate);
          // drop any menu plans/recipes that have expired:
          currentOutlet = flatOutletWithoutExpiredMenuPlans(currentOutlet, todaysDate);
          return { ...outlet, hasData: Boolean(currentOutlet) };
        }).filter(e => e);
        await DeviceStorage.writeOutletSettings(selectedOutletsValidMenuPlans);
        // Pick the first outlet and use that in consumer screens
        let currentOutlet;
        const selectedOutletsMenuPlansHasData = selectedOutletsValidMenuPlans.filter(item => item.hasData);
        if (selectedOutletsMenuPlansHasData.length > 0) {
          currentOutlet = ompServerResponse.getOutlet(selectedOutletsMenuPlansHasData[0].id);
        } else {
          currentOutlet = ompServerResponse.getFirstOutlet();
        }
        // grab the same outlet from "selectedMenuPlans"
        const outlet = selectedMenuPlans.find(
          o => o.outletId === currentOutlet.id
        );
        if (
          outletSettings[currentOutlet.id] &&
          outletSettings[currentOutlet.id].merged
        ) {
          // e.g. outlet = {"outletId":"G20202",
          //                "menus":[ {"menuId":"180318940","menuName":"Menu plan 1", order:1},
          //                          {"menuId":"180318942","menuName":"Menu plan 2", order:2}]}
          currentOutlet = currentOutlet.mergedMenuPlans(outlet.menus, todaysDate);
        }
        currentOutlet = currentOutlet.flattened(outlet.menus, todaysDate);
        this.saveCurrentFlatOutlet(currentOutlet, recipesContext);
      } else {
        // server response is not valid.
        this.logger.debug('DataRefresh', 'Got and invalid server response');
        throw new Error(ompServerResponse.error);
      }
    } catch (e) {
      console.error("ERROR MESSAGE:", e.message);
      console.error("ERROR STACK:", e.stack);
      throw e;
    }
  }

  async clearMenuPlanDeviceData(recipesContext, adminContext, menuContext) {
    try {
      menuContext.clearRecipeData();
      recipesContext.clearAllRecipes();
      recipesContext.setVisibleRecipes([])
      recipesContext.setAllergens([])
      recipesContext.setPossibleAllergens([])
      recipesContext.setSelectedMenuPlanIds([])
      recipesContext.setVisibleDayParts([])
      recipesContext.setSearchQueryFilter([])

      // adminContext.setSelectedMenuPlans([])
      // adminContext.setOutletNameOverrides([])
      // adminContext.setOutletSettings([])
      // adminContext.setSelectedOutlets([])
    } catch (e) {
      this.logger.error('clearMenuPlanDeviceData', 'Failed to update context');
    }

    try {
      await DeviceStorage.removeAsyncStorageItemByKey('outletData');
    } catch (e) {
      this.logger.error('clearMenuPlanDeviceData', 'Failed to remove outletData from DeviceStorage');
    }

    // try {
    //   await DeviceStorage.removeAsyncStorageItemByKey('menusSettings');
    // } catch (e) {
    //   this.logger.error('clearMenuPlanDeviceData', 'Failed to remove menusSettings from DeviceStorage');
    // }

    // try {
    //   await DeviceStorage.removeAsyncStorageItemByKey('outletsSettings');
    // } catch (e) {
    //   this.logger.error('clearAllDeviceData', 'Failed to remove outletsSettings from DeviceStorage');
    // }

    // Remove saved files possibly?
  }

  /**
   * saveCurrentFlatOutlet:
   *
   * Stores the current flat outlet into both the device storage
   * (so it can be read the next time the app restarts)
   * and the contexts so it can be seen in the consumer screens.
   *
   * @param {Object} flatOutlet Outlet in "flat" structure
   */
  saveCurrentFlatOutlet(flatOutlet, recipesContext) {
    // Store the currently selected outlet as a flat structure in device storage
    // so that the app can load it the next time it starts.
    this.deviceStorage.writeFlatOutlet(flatOutlet);

    // Read the current allergens and possible Allergens.
    // Use those to filter out recipes from flatoutlet as will be changing
    // the outlet and don't want to lose the allergens.
    // Make sure recipes with the selected allergens are not visible:
    // const { data } = this.recipesContext; // read current selected allergens
    const { allergens, possibleAllergens } = recipesContext;
    const selectedMenuPlansIds = flatOutlet.menu_plans.map(m => m.id);

    console.log(
      '========== FLAT OUTLET RECIPES BEFORE FILTER ==========',
      flatOutlet.recipes.map(r => ({
      recipeId: r.recipeId,
      name: r.longName,
      type: r.type,
      menu_plan: r.menu_plan,
      day_part: r.day_part,
      contains: r.contains,
      may_contain: r.may_contain,
      ingredients: r.ingredients
    }))
    );

    const filteredRecipes = filterRecipes(
      flatOutlet.recipes,
      null, // all menu plans
      null, // all day parts
      normalizeAllergen(allergens),
      normalizeAllergen(possibleAllergens),
      ''
    );

    console.log(
      '========== RECIPES AFTER FILTER ==========',
    filteredRecipes.map(r => ({
    recipeId: r.recipeId,
    name: r.longName,
    type: r.type,
    contains: r.contains,
    may_contain: r.may_contain
   }))
  );

    // const visibleDayParts = filterDayPartsFromMenuPlans(
    //   {
    //     visibleRecipes: filteredRecipes,
    //     selectedMenuPlanIds: selectedMenuPlansIds,
    //     dayParts: flatOutlet.day_parts
    //   },
    //   this.recipesContext
    // );

    // store the currently selected outlet in the contexts so they appear on screen.
    this.menuContext.setFlatOutlet(flatOutlet);

    recipesContext.setOutletData(
      flatOutlet,
      flatOutlet.day_parts,
      filteredRecipes,
      allergens,
      possibleAllergens
    );
  }
}
