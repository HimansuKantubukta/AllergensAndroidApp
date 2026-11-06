import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { registerPushTokenForOutletIds } from "./RemoteAPI";

export function setupNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async() => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false
    })
  });
}

function makeAlertOnce() {
  let alertCalled = false;
  return function(s) {
    if (!alertCalled) {
      alertCalled = true;
      // eslint-disable-next-line no-alert
      alert(s);
    }
  };
}

const alertOnce = makeAlertOnce();

export async function registerForPushNotificationsAsync(insertLog) {
  let token = 'dummy-token';

  insertLog(`registerForPushNotificationsAsync called.`);

  if (Constants.isDevice) {
    insertLog(`registerForPushNotificationsAsync: It is a device`);
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    insertLog(`registerForPushNotificationsAsync: Got permission result`);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      insertLog(
        `registerForPushNotificationsAsync: existing status is not granted`
      );
      const { status } = await Notifications.getPermissionsAsync();
      finalStatus = status;
    } else {
      insertLog(
        `registerForPushNotificationsAsync: existing status is granted`
      );
    }
    if (finalStatus !== 'granted') {
      insertLog(
        `registerForPushNotificationsAsync: final status is not granted`
      );
      insertLog('Failed to get push token for push notification.');
      return token;
    }
    insertLog(`registerForPushNotificationsAsync: final status is granted`);
    insertLog(
      `registerForPushNotificationsAsync: going to wait for getDevicePushTokenAsync`
    );
    token = (await Notifications.getDevicePushTokenAsync()).data;
    insertLog(`registerForPushNotificationsAsync: Got token`);
  } else {
    insertLog(
      `registerForPushNotificationsAsync: ust use physical device for Push Notifications`
    );
    // eslint-disable-next-line no-alert
    alertOnce('Emulator: must use physical device for push notifications');
    return token;
  }

  async function registerForPushNotificationsAndNotifyServer() {
    const token = await registerForPushNotificationsAsync();
    await registerTokenInServer(token);
    return token;
  }

  if (Platform.OS === 'android') {
    insertLog(`registerForPushNotificationsAsync: platform is android`);
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC
    });
  }

  insertLog(`registerForPushNotificationsAsync: all done`);

  return token;
}

/**
 * registerPushNotificationReceivedListener:
 * Utility wrapper around addNotificationReceivedListener.
 * Registers function fn to be executed when the notification
 * is received and the app is in Foreground.
 * @param {*} fn
 */
export function registerPushNotificationReceivedInForeground(fn) {
  // This listener is fired whenever a notification
  //  is received while the app is foregrounded
  Notifications.addNotificationReceivedListener(fn);
}

/**
 * registerPushNotificationClicked:
 *
 * Utility wrapper around addNotificationResponseReceivedListener.
 * Registers function fn to be executed when a user taps on or interacts with
 * a notification (works when app is foregrounded, backgrounded, or killed)
 *
 * @param {*} fn
 */
export function registerPushNotificationClicked(fn) {
  // This listener is fired whenever
  Notifications.addNotificationResponseReceivedListener(fn);
}

/**
 * notifyBackendOfToken:
 *
 * Notifies the backend that the given token is interested in the given outletIds.
 * This will enable it to send a push notification every time
 * one of those outlets is changed.
 *
 * @param {string} token
 * @param {Array of String} outletIds
 */
export async function notifyBackendOfToken(token, outletIds, authToken) {
  await registerPushTokenForOutletIds(token, outletIds, authToken);
}
