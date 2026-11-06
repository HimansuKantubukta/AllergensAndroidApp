import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import * as Network from 'expo-network';
import { dismissNotificationAsync } from 'expo-notifications';
import { debounce } from 'debounce';
import { navigate } from '../navigation/navigationHelper';
import AdminContext from '../../context/AdminContext';
import MenuContext from '../../context/MenuContext';
import RecipesContext from '../../context/RecipesContext';
import DeviceStorage from '../../services/DeviceStorage';
import Logger from '../../services/Logger';
import DataRefresher from '../../services/DataRefresher';
import theme from '../../styles/theme.style';
import {
  registerForPushNotificationsAsync,
  registerPushNotificationReceivedInForeground,
  registerPushNotificationClicked,
  notifyBackendOfToken
} from '../../services/Notifications';
import LoadingPopup from '../popups/loadingPopup';
import ConfirmationPopup from '../popups/confirmationPopup';

const logger = Logger.getLogger();

/**
 * This is a logic component (no display) used to setup
 * push notification handling logic. It cannot be done in App.js
 * as that is class component.
 */

export default function PushNotificationHandler({ children }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDone, setIsDone] = useState(true);
  const [isError, setIsError] = useState(false);
  const adminContext = useContext(AdminContext);
  const menuContext = useContext(MenuContext);
  const recipesContext = useContext(RecipesContext);
  const [networkConnection, setNetworkConnection] = useState(true);
  const refresherService = new DataRefresher(
    adminContext,
    menuContext,
    recipesContext,
    DeviceStorage,
    logger
  );

  /**
   * readAdminSettingsFromDeviceStorage:
   * Reads the selected outlets and menu plans from device storage.
   * Saves them in the adminContext.
   * Returns the read data as an object with `menusSettings` and `outletsSettings`.
   */
  async function readAdminSettingsFromDeviceStorage() {
    logger.trace(
      'readAdminSettingsFromDeviceStorage',
      'reading configured outlets from storage'
    );
    const outletsSettings = await DeviceStorage.readOutletSettings();
    if (outletsSettings) {
      adminContext.setSelectedOutlets(outletsSettings);
    }
    const menusSettings = await DeviceStorage.readSelectedMenuPlans();
    if (menusSettings) {
      adminContext.setSelectedMenuPlans(menusSettings);
    }
    return {
      menusSettings,
      outletsSettings
    };
  }

  /**
   * Returns promise resolved when data is updated.
   */
  async function updateDataOnTablet() {
    setIsDone(false);
    setIsUpdating(true);
    const network = await Network.getNetworkStateAsync();
    if (network.isInternetReachable && network.isConnected) {
      try {
        await refresherService.refreshOutletMenuPlans(
          menuContext,
          recipesContext,
          adminContext
        );
        setIsDone(true);
        setTimeout(function() {
          setIsUpdating(false);
        }, 2000);
      } catch (error) {
        setIsDone(true);
        setIsError(error);
      }
    } else {
      console.log(`No internet connection`);
      setNetworkConnection(false);
    }
  }

  /**
   * Called when any notification is received.
   * There are 2 notifications possible at the moment.
   * One is sent when calling /tradingoutlet takes too long.
   * The other is sent when there is new data to update manually.
   * We distinguish them by their `data`.
   * @param {*} notification
   */
  function handleNotificationReceived(notification) {
    const isSlowOutlets =
      notification &&
      notification.request &&
      notification.request.content &&
      notification.request.content.data &&
      notification.request.content.data.notificationCode === 'SLOW_OUTLETS';
    // true for the notification sent when /tradingoutlets takes too long.

    logger.trace(
      'handleNotificationReceived',
      `Got a notification ${JSON.stringify(notification)}`
    );
    // dispatch based on type of notification
    if (isSlowOutlets) {
      handleSlowOutletNotification(notification);
    } else {
      // Go to Admin login screen
      navigate('AdminWrapper');
      // updateDataOnTablet(notification);
    }
  }

  function handleSlowOutletNotification(notification) {
    adminContext.setSlowTradingOutletsRequest(false); // request done so no longer slow.
    dismissNotificationAsync(notification.identifier);
  }

  /**
   * setupHandlers sets listeners for push notifications.
   * When a notification is received and the app is in foreground,
   * it will auto update and when the notification is clicked,
   * it jumps to the app.
   */
  async function setupHandlers(settings) {
    let selectedOutlets = settings.outletsSettings;
    if (Array.isArray(selectedOutlets) && selectedOutlets.length === 0) {
      selectedOutlets = await DeviceStorage.readOutletSettings();
    }
    const token = await registerForPushNotificationsAsync(
      logger.trace.bind(logger)
    );

    logger.trace('setupHandlers', `Got a push token ${token}`);

    registerPushNotificationReceivedInForeground(
      debounce(
        notification => {
          handleNotificationReceived(notification);
        },
        5000,
        true
      )
    );

    registerPushNotificationClicked(
      debounce(
        response => {
          handleNotificationReceived(response);
        },
        5000,
        true
      )
    );

    logger.trace('setupHandlers', `notification handlers set`);
    logger.trace(
      'setupHandlers',
      `selectedOutlets: ${JSON.stringify(selectedOutlets)}`
    );

    try {
      if (selectedOutlets) {
        logger.trace('setupHandlers', 'Going to notify backend of the token');
        await notifyBackendOfToken(
          token,
          selectedOutlets.map(x => x.id), // array of ids only
          adminContext.authCode
        );
      } else {
        throw Error('Problem with outlet settings');
      }
    } catch (error) {
      logger.error(
        'setupHandlers',
        `Could not notify backend of our token ${JSON.stringify(error)}`
      );
    }

    adminContext.setPushToken(token);
  }

  function closeErrorMessage() {
    setIsError(false);
    setIsUpdating(false);
  }

  async function simulateNotificationReceived() {
    updateDataOnTablet();
  }

  useEffect(() => {
    async function setup() {
      const settings = await readAdminSettingsFromDeviceStorage();
      await setupHandlers(settings);
      console.log('PushNotificationHandler: useEffect setup() finished.');
    }
    setup();
    return () => {}; // cleanup function
  }, []);

  return isUpdating
    ? [
        <LoadingPopup
          key="loading-popup"
          visible={isUpdating}
          loading={!isDone}
          done={isDone}
          error={isError}
        />,
        <ConfirmationPopup
          key="confirmation-popup"
          visible={!!isError}
          handleClose={closeErrorMessage}
          handleYes={closeErrorMessage}
          error={isError}
          networkConnection={networkConnection}
        />
      ]
    : [
        children
        // <TestNotificationButton
        //   key="testNotificationButton"
        //   display
        //   sendTestNotification={simulateNotificationReceived}
        // />
      ];
}
