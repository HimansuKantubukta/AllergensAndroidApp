/**
 * DeviceStorage: a wrapper around react-native AsyncStorage.
 * Use it to store outlet and configuration information.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export default class DeviceStorage {
  /** @private */
  static async readAsyncStorageByKey(storageKey) {
    try {
      const value = await AsyncStorage.getItem(storageKey);
      return JSON.parse(value);
    } catch (_error) {
      return null;
    }
  }

  /** @private */
  static async removeAsyncStorageItemByKey(storageKey) {
    try {
      await AsyncStorage.removeItem(storageKey);
      return true;
    } catch (_error) {
      return false;
    }
  }

  /** @private */
  static async readFileStorageByKey(storageKey) {
    // eslint-disable-next-line prefer-template
    return FileSystem.readAsStringAsync(FileSystem.documentDirectory + "/" + storageKey);
  }

  /** @private */
  static async ensureDocumentDirectoryExists() {
    const { exists } = await FileSystem.getInfoAsync(FileSystem.documentDirectory);
    if (!exists) await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory);
  }

  /** @private */
  static async writeFileStorage(storageKey, content) {
    // eslint-disable-next-line prefer-template
    await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "/" + storageKey, content);
  }

  /** @private */
  static async removeAllFileStartingWith(pattern) {
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);

    await Promise.all(files.map(file => {
      return file.startsWith(pattern)
        // eslint-disable-next-line prefer-template
        ? FileSystem.deleteAsync(FileSystem.documentDirectory + "/" + file, { idempotent: true })
        : Promise.resolve();
    }));
  }


  /**
   * readOutletMenuPlans:
   *
   * Returns the last response we got from the "getoutletmenuplans"
   * remote endpoint. Contains data about all the outlets that were
   * selected, their menu plans and their recipes.
   */
  static async readOutletMenuPlans(outletId) {
    try {
      const content = await DeviceStorage.readFileStorageByKey(`getoutletmenuplans-${outletId}.json`);
      return JSON.parse(content);
    } catch (_error) {
      return null;
    }
  }

  /**
   * writeOutletMenuPlans:
   *
   * Writes the response of /getoutletmenuplans into the device storage.
   *
   * A: An instance of a GetOutletMenuPlans object. Contains information about
   * all outlets, all menu plans and all recipes requested from a remote server.
   * @param {GetOutletMenuPlansServerResponse} getOutletMenuPlanResponse See A
   */
  static async writeOutletMenuPlans(getOutletMenuPlanResponse) {
    await DeviceStorage.ensureDocumentDirectoryExists();
    await DeviceStorage.removeAllFileStartingWith('getoutletmenuplans');
    return Promise.all(getOutletMenuPlanResponse.map(outlet => {
      return DeviceStorage.writeFileStorage(`getoutletmenuplans-${outlet.outletId}.json`, JSON.stringify(outlet))
    }));
  }

  /**
   * readFlatOutlet:
   *
   * Returns a Promise to a "flat outlet". The one currently selected.
   */
  static async readFlatOutlet() {
    return DeviceStorage.readAsyncStorageByKey('outletData');
  }

  /**
   *
   */
  static writeFlatOutlet(outlet) {
    return AsyncStorage.setItem('outletData', JSON.stringify(outlet));
  }

  /**
   * TODO: what's the shape of outletsSettings ?
   */
  static async readOutletSettings() {
    try {
      const settings = JSON.parse(
        await AsyncStorage.getItem('outletsSettings')
      );
      return settings;
    } catch (error) {
      return null;
    }
  }

  /**
   * Returns a promise. Writes the configuration for the selected outlets.
   */
  static async writeOutletSettings(settingsObj) {
    return AsyncStorage.setItem('outletsSettings', JSON.stringify(settingsObj));
  }

  /**
   *
   */
  static async readSelectedMenuPlans() {
    return DeviceStorage.readAsyncStorageByKey('menusSettings');
  }

  /**
   * Returns a promise. Writes the configuration for the selected menu plans.
   */
  static writeSelectedMenuPlans(selectedMenuPlans) {
    return AsyncStorage.setItem(
      'menusSettings',
      JSON.stringify(selectedMenuPlans)
    );
  }

  /**
   * readOutletNameOverrides: returns an object (map) whose keys
   * are outlet ids and values are strings. Used to override
   * the name of an outlet by the user.
   */
  static async readOutletNameOverrides() {
    try {
      const storedItem = await AsyncStorage.getItem('outletNameOverrides');
      const settings = JSON.parse(storedItem);
      return settings;
    } catch (error) {
      console.log(
        `readOutletNameOverrides: Error reading outlet name overrides: ${JSON.stringify(
          error
        )}`
      );
      return {}; // no overrides;
    }
  }

  /**
   * Returns a promise. Writes the configuration for outlet name overrides.
   * @see readOutletNameOverrides
   * @param {Object} overrides an object whose keys are outlet ids, values are strings.
   */
  static writeOutletNameOverrides(overrides) {
    const value = JSON.stringify(overrides);
    return AsyncStorage.setItem('outletNameOverrides', value);
  }

  /**
   * Returns a promise. Writes additional settings per outlet.
   */
  static writePerOutletSettings(settings) {
    return AsyncStorage.setItem('perOutletSettings', JSON.stringify(settings));
  }

  static readPerOutletSettings() {
    return DeviceStorage.readAsyncStorageByKey('perOutletSettings');
  }

  /**
   * Returns a promise. Writes the current date as ISO string to storage
   * @param {Date} oDate Date object of recipes being saved
   */
  static writeRecipeSaveDay(oDate) {
    return AsyncStorage.setItem('recipeSaveDay', oDate.toISOString());
  }

  /**
   * Returns the date stored when recipes were saved
   */
  static async readRecipeSaveDay() {
    const isoDate = await AsyncStorage.getItem('recipeSaveDay');
    return new Date(isoDate);
  }

  /**
  * Returns a promise. Writes the if outlets have manual refresh set
  * @param {Boolean} outletsWithManualRefresh
  */
  static writeOutletsWithManualRefresh(outletsWithManualRefresh) {
    const stringVal = outletsWithManualRefresh ? 'X' : '';
    return AsyncStorage.setItem('outletsWithManualRefresh', stringVal);
  }

  /**
   * Returns the date stored when recipes were saved
   */
  static async readOutletsWithManualRefresh() {
    const storedVal = await AsyncStorage.getItem('outletsWithManualRefresh');
    return storedVal === 'X' ? true : false;
  }
}
