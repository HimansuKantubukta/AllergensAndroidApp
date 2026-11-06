/* eslint-disable object-shorthand */
import React, { useEffect, useState, useMemo, useContext } from 'react';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import * as Network from 'expo-network';
import { View, TouchableOpacity } from 'react-native';
import { Text, Icon, Button } from 'react-native-elements';
import AdminHeader from '../../components/adminHeader';
import styles from './styles';
import { outletsURL } from '../../../config/urls';
import AdminContext from '../../context/AdminContext';
import { fetchOutletMenuPlansData } from '../adminSummary';
import ConfirmationPopup from '../../components/popups/confirmationPopup';
import LoadingPopup from '../../components/popups/loadingPopup';
import MenuContext from '../../context/MenuContext';
import RecipesContext from '../../context/RecipesContext';
import Logger from '../../services/Logger';
import DeviceStorage from '../../services/DeviceStorage';
import DataRefresher from '../../services/DataRefresher';
import theme from '../../styles/theme.style';
import TestNotificationButton from '../../components/buttons/testNotificationBtn';
import { prepareRequestHeaders } from '../../utils/object-utils';
import buildK from '../../utils/request-utils';

const logger = Logger.getLogger();

/**
 *
 * @param {*} setMenusSettings
 * @param {*} adminContext
 */
const readAdminSettingsFromDeviceStorage = async (
  setMenusSettings,
  adminContext
) => {
  const outletsSettings = await DeviceStorage.readOutletSettings();
  const menusSettings = await DeviceStorage.readSelectedMenuPlans();

  if (menusSettings) {
    setMenusSettings(menusSettings);
    adminContext.setSelectedMenuPlans(menusSettings);
  }
  if (outletsSettings) {
    adminContext.setSelectedOutlets(outletsSettings);
  }
};

/**
 *
 * @param {*} params
 * @param {*} adminContext
 */
const useFetch = (params, adminContext, setLoading, setBackendIsSlow) => {
  const [data, setData] = useState(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    async function fetching() {
      setLoading(true);
      const service = outletsURL;
      const url = service.url.replace('%userId', params.userId);
      

      const headers = prepareRequestHeaders(
        // injects api-key
        {
          Authorization: adminContext.authCode,
          'content-type': 'application/json',
          Token: adminContext.pushToken // required in case the request takes too long.
          // In that case we get a 404 and then a push notification when data is ready.
        },
        buildK()
      );
      logger.traceRequest(url, 'GET', 'Key hidden', null /* ,headers */);
      try {
        const response = await axios({
          method: 'GET',
          url: url,
          headers: headers,
          // `validateStatus` defines whether to resolve or reject the promise for a given
          // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
          // or `undefined`), the promise will be resolved; otherwise, the promise will be
          // rejected.
          validateStatus: function validateStatus(status) {
            return status >= 200 && status < 300;
          }
        });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        logger.error('adminHome', JSON.stringify(err));
        // check the response status
        if (err.response.status === 404 || err.response.status === '404') {
          // we get a 404 if the backend
          // is still preparing these results.
          setBackendIsSlow(true);
        } else {
          // check the error code.
          console.log(`${JSON.stringify(err)}`);
          setError(err);
        }
        setLoading(false);
      }
    }
    adminContext.setUserID(params.userId);
    adminContext.setSelectedOutlets([]);
    adminContext.setSelectedMenuPlans([]);
    if (!params.slowTradingOutletsRequest) {
      // prevents fetching again when `slowTradingOutletsRequest` transitions from false to true
      // but fetches again when it changes from true to false.
      fetching();
    }
  }, [params]);

  return { outlets: data, error: error };
};

/**
 *
 */
export default function AdminHome({ navigation, route }) {
  const adminContext = useContext(AdminContext);
  const menuContext = useContext(MenuContext);
  const recipesContext = useContext(RecipesContext);

  const [menusSettings, setMenusSettings] = useState([]);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [uploadingVisible, setUploadingVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [networkConnection, setNetworkConnection] = useState(true);
  const refresherService = new DataRefresher(
    adminContext,
    menuContext,
    recipesContext,
    DeviceStorage,
    logger
  );
  const { id } = route.params;
  const props = { userId: id };

  useEffect(() => {
    adminContext.setSlowTradingOutletsRequest(false);
  }, [])

  const params = useMemo(
    () => ({
      userId: props.userId,
      slowTradingOutletsRequest: adminContext.slowTradingOutletsRequest
    }),
    [props.userId, adminContext.slowTradingOutletsRequest]
  );
  const [outletsReqLoading, setOutletsReqLoading] = useState(false);
  const { outlets, error: outletsError } = useFetch(
    params,
    adminContext,
    setOutletsReqLoading,
    adminContext.setSlowTradingOutletsRequest
  );
  if (outletsError && !error) {
    setError(outletsError);
    setConfirmationVisible(true);
  }

  const disabledOutlets =
    outlets === null ||
    outletsReqLoading ||
    (adminContext && adminContext.slowTradingOutletsRequest);

  const disabledMenuPlans =
    disabledOutlets ||
    !menusSettings ||
    menusSettings.length === 0 ||
    outletsReqLoading ||
    (adminContext && adminContext.slowTradingOutletsRequest);

  const disabledDataUpdate =
    !menusSettings ||
    menusSettings.length === 0 ||
    outletsReqLoading ||
    (adminContext && adminContext.slowTradingOutletsRequest);

  function handleYes() {
    setLoading(true);
    setError(false);
    if (networkConnection) {
      setUploadingVisible(true);
      setConfirmationVisible(false);
      fetchOutletMenuPlansData(
        refresherService,
        adminContext,
        setLoading,
        setError,
        setData,
        setUploadingVisible,
        navigation,
        setConfirmationVisible,
        menuContext,
        recipesContext
      );
    }
  }

  function closePopup() {
    setError(false);
    setConfirmationVisible(false);
    if (outletsError) {
      navigation.navigate('Home');
    }
  }

  const isConnectedToNetwork = async () => {
    try {
      const network = await Network.getNetworkStateAsync();
      if (network.isInternetReachable && network.isConnected) {
        setNetworkConnection(true);
      } else {
        setNetworkConnection(false);
      }
    } catch (e) {
      setNetworkConnection(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      readAdminSettingsFromDeviceStorage(setMenusSettings, adminContext);

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );
  return (
    <>
      <View style={styles.container}>
        <ConfirmationPopup
          visible={confirmationVisible}
          handleClose={closePopup}
          handleYes={handleYes}
          styles={styles}
          error={error}
          networkConnection={networkConnection}
        />
        <LoadingPopup
          visible={uploadingVisible}
          loading={loading}
          done={data}
          error={error}
          styles={styles}
        />
        <AdminHeader navigation={navigation} displayConsumerMode />
        <Text style={styles.title}>Display Settings</Text>

        {/* OUTLETS */}
        <TouchableOpacity
          disabled={disabledOutlets}
          onPress={() => navigation.navigate('Outlets', { outlets })}
          activeOpacity={0.7}
          style={
            !disabledOutlets
              ? styles.button
              : [styles.button, styles.disabledButton]
          }>
          <Text
            style={
              !disabledOutlets ? styles.clickableText : styles.buttonTextOpacity
            }>
            Outlets
          </Text>
          <Icon
            containerStyle={styles.iconStyle}
            name="keyboard-arrow-right"
            size={40}
            color={
              !disabledMenuPlans ? theme.darkgray : 'rgba(68, 68, 68, 0.4)'
            }
          />
        </TouchableOpacity>
        {/* MENU PLANS */}
        <TouchableOpacity
          onPress={() => navigation.navigate('MenuPlans')}
          activeOpacity={0.7}
          disabled={disabledMenuPlans}
          style={
            !disabledMenuPlans
              ? styles.button
              : [styles.button, styles.disabledButton]
          }>
          <Text
            style={
              !disabledMenuPlans
                ? styles.clickableText
                : styles.buttonTextOpacity
            }>
            Menu Plans
          </Text>
          <Icon
            containerStyle={styles.iconStyle}
            name="keyboard-arrow-right"
            size={40}
            color={
              !disabledMenuPlans ? theme.darkgray : 'rgba(68, 68, 68, 0.4)'
            }
          />
        </TouchableOpacity>
        {adminContext && adminContext.slowTradingOutletsRequest ? (
          <Text style={styles.longLoginWaitText}>
            This is taking longer than usual... please wait.
          </Text>
        ) : null}
      </View>
      {__DEV__ ? (
        <TestNotificationButton
          display
          title="Simulate Slow_outlets notification received"
          sendTestNotification={() =>
            adminContext.setSlowTradingOutletsRequest(false)
          }
        />
      ) : null}
      <Button
        disabled={disabledDataUpdate}
        title="Manual data update"
        buttonStyle={styles.manualDataButton}
        containerStyle={styles.buttonContainer}
        titleStyle={styles.buttonTitle}
        type="solid"
        onPress={() => {
          isConnectedToNetwork();
          setData(null);
          setConfirmationVisible(true);
        }}
      />
    </>
  );
}
