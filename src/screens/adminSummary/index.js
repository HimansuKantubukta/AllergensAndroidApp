/* eslint-disable prefer-template */
import React, { useState, useContext } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import * as Network from 'expo-network';
import AdminPageIndicator from '../../components/adminPageIndicator';
import AdminHeader from '../../components/adminHeader';
import AdminContext from '../../context/AdminContext';
import AdminBottom from '../../components/adminBottom';
import styles from './styles';
import OutletName from '../../components/outletName';
import BackButton from '../../components/buttons/BackBtn';
import ConfirmationPopup from '../../components/popups/confirmationPopup';
import LoadingPopup from '../../components/popups/loadingPopup';
import MenuContext from '../../context/MenuContext';
import RecipesContext from '../../context/RecipesContext';
import Logger from '../../services/Logger';
import DeviceStorage from '../../services/DeviceStorage';
import DataRefresher from '../../services/DataRefresher';
import {
  registerForPushNotificationsAsync,
  notifyBackendOfToken
} from '../../services/Notifications';
import { byOrder } from '../../utils/array-utils';
import { hasMenuPlans, menuPlansForOutlet } from '../../domain/Outlet';

const logger = Logger.getLogger();

/**
 * Builds a white box with the outlet on the left and the menu plans on the right.
 * @param {Array} selectedOutlets
 * @param {String} outletId Specific outlet ID
 * @param {Array} allSelectedMenuPlans All Selected menu plans
 */
function outletDisplay(
  selectedOutlets,
  outletId,
  outletNameOverrides,
  selectedMenuPlans = [],
  outletSettings = {}
) {
  // find the outlet in outlets
  const outlet = selectedOutlets.find(o => o.id === outletId);
  if (!outlet) {
    console.log('Could not find outlet with id ' + outletId);
    return null;
  }
  const selectedMenusForOutlet = menuPlansForOutlet(
    outletId,
    selectedMenuPlans
  );

  return (
    <View key={outletId} style={styles.outlet}>
      <OutletName
        outletId={outletId}
        name={outletNameOverrides[outletId] || outlet.name}
      />

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
      </View>

      <View style={[styles.outletMenuPlansContainer]}>
        {selectedMenusForOutlet.sort(byOrder).map(m => (
          <Text key={m.menuId} style={[styles.menuName]}>
            {m.menuName}
          </Text>
        ))}
        {outletSettings[outletId] && outletSettings[outletId].merged ? (
          <Text key="merge" style={styles.mergedText}>
            (merged as a single menu plan)
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export function storeOutletNameOverrides(adminContext) {
  return DeviceStorage.writeOutletNameOverrides(
    adminContext.outletNameOverrides
  );
}

export function storePerOutletSettings(adminContext) {
  return DeviceStorage.writePerOutletSettings(adminContext.outletSettings);
}

export async function fetchOutletMenuPlansData(
  refresherService,
  admContext,
  setLoading,
  setError,
  setDone,
  setUploadingVisible,
  navigation,
  setConfirmationVisible,
  menuContext,
  recipesContext
) {
  try {
    await refresherService.refreshOutletMenuPlans(
      menuContext,
      recipesContext,
      admContext
    );
    setDone(true);
    setLoading(false);
    setError(false);
    setTimeout(() => {
      setUploadingVisible(false);
      navigation.navigate('AdminHome', { id: admContext.userId || 0 });
    }, 3000);
  } catch (error) {
    logger.trace('fetchOutletMenuPlansData', `Error: ${error}`);
    setError(true);
    setLoading(false);
    setConfirmationVisible(true);
    setUploadingVisible(false);
    setDone(false);
    // TODO: How to display the error message ?
  }
}

/**
 * When the set of selected outlets changes, we need to
 * tell the backend so that it can notify us when data updates.
 */
async function notifyBackendOfSubscription(selectedOutlets, adminContext) {
  const token = await registerForPushNotificationsAsync(
    logger.trace.bind(logger)
  );

  try {
    if (selectedOutlets) {
      logger.trace(
        'notifyBackendOfSubscription',
        'Going to notify backend of the token'
      );
      await notifyBackendOfToken(
        token,
        selectedOutlets.map(x => x.id), // array of ids only
        adminContext.authCode
      );
    } else {
      throw Error('notifyBackendOfSubscription error');
    }
  } catch (error) {
    logger.error(
      'notifyBackendOfSubscription',
      `Could not notify backend of our token ${JSON.stringify(error)}`
    );
  }
}

/**
 *
 */
export default function AdminSummary({ navigation }) {
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [uploadingVisible, setUploadingVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [flatOutletData, setFlatOutletData] = useState(null);
  const [networkConnection, setNetworkConnection] = useState(true);
  const adminContext = useContext(AdminContext);
  const menuContext = useContext(MenuContext);
  const recipesContext = useContext(RecipesContext);
  const refresherService = new DataRefresher(
    adminContext,
    menuContext,
    recipesContext,
    DeviceStorage,
    logger
  );

  const handleYes = async () => {
    setLoading(true);
    setError(false);
    await isConnectedToNetwork();
    if (networkConnection) {
      setUploadingVisible(true);
      setConfirmationVisible(false);
      try {
        await storeOutletNameOverrides(adminContext);
        await storePerOutletSettings(adminContext);
        await DeviceStorage.writeOutletSettings(adminContext.selectedOutlets);
        await DeviceStorage.writeSelectedMenuPlans(
          adminContext.selectedMenuPlans
        );
        await notifyBackendOfSubscription(
          adminContext.selectedOutlets,
          adminContext
        );
        fetchOutletMenuPlansData(
          refresherService,
          adminContext,
          setLoading,
          setError,
          setFlatOutletData,
          setUploadingVisible,
          navigation,
          setConfirmationVisible,
          menuContext,
          recipesContext
        );
      } catch (error) {
        setError(true);
      }
    }
  };

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

  function closePopup() {
    setConfirmationVisible(false);
  }

  return (
    <View style={{ flex: 1 }}>
      <ConfirmationPopup
        visible={confirmationVisible}
        handleClose={closePopup}
        handleYes={handleYes}
        error={error}
        styles={styles}
        networkConnection={networkConnection}
      />
      <LoadingPopup
        visible={uploadingVisible}
        loading={loading}
        done={flatOutletData}
        error={error}
        styles={styles}
      />
      <AdminContext.Consumer>
        {({
          selectedOutlets,
          selectedMenuPlans,
          outletNameOverrides,
          outletSettings
        }) => (
          <View style={styles.container}>
            <AdminHeader navigation={navigation} />
            <View style={styles.titleContainer}>
              <BackButton onPress={() => navigation.goBack()} />
              <Text style={styles.title}>
                Confirm Menu Plans for selected Outlets
              </Text>
              {/* Dummy element so title is centered */}
              <View style={styles.dummy} />
            </View>

            <AdminPageIndicator active={'AdminSummary'} />
            <Text style={styles.subtitle}>
              Confirm the menu plans you have selected for the chosen Outlets.
            </Text>
            <View style={styles.scrollViewContainer}>
              <ScrollView style={styles.scrollView}>
                {selectedOutlets &&
                  selectedOutlets
                    .sort((o1, o2) => ('' + o1.id).localeCompare('' + o2.id))
                    .filter(o => hasMenuPlans(o.id, selectedMenuPlans))
                    .map(outlet =>
                      outletDisplay(
                        selectedOutlets,
                        outlet.id,
                        outletNameOverrides,
                        selectedMenuPlans,
                        outletSettings
                      )
                    )}
              </ScrollView>
            </View>
            <AdminBottom
              outlets={selectedOutlets}
              navigation={navigation}
              saveOutlets={() => {}}
              proceedButtonText={error ? 'Retry' : 'Confirm'}
              nextHandler={() => {
                isConnectedToNetwork();
                setConfirmationVisible(true);
              }}
            />
          </View>
        )}
      </AdminContext.Consumer>
    </View>
  );
}
