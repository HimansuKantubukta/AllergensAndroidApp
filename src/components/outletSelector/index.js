import React, { useContext } from 'react';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, View } from 'react-native';
import theme from '../../styles/theme.style';
import Logger from '../../services/Logger';
import AdminContext from '../../context/AdminContext';
import MenuContext from '../../context/MenuContext';
import RecipesContext from '../../context/RecipesContext';
import DeviceStorage from '../../services/DeviceStorage';
import DataRefresher from '../../services/DataRefresher';
import { assertObject } from '../../utils/assertions';
import { hasItems } from '../../utils/array-utils';
import { hasMenuPlans, Outlet } from '../../domain/Outlet';
import { flatOutletWithoutExpiredMenuPlans } from '../../domain/flatOutlet';

const logger = Logger.getLogger();

/**
 * onOutletChanged: Called when the user selects a different outlet.
 * At a high level, we read that outlet info from Device storage
 * and set in the context so it gets reflected on the screen.
 * @param {*} newOutletId
 * @param {*} refresherService
 * @param {bool} mergeMenuPlans true if the menu plans should be merged
 * @param {Array} selectedMenuPlans Array of outlets, each with a .menus property which are the menuplans of that outlet.
 */
export async function onOutletChanged(
  newOutletId,
  refresherService,
  mergeMenuPlans,
  selectedMenuPlans,
  recipesContext,
  adminContext
) {
  if (!newOutletId) {
    return;
  }

  const date = recipesContext.outletSelectionDate;

  // This is what we do in detail:
  // We read the selected outlet from device storage.
  // We convert that outlet into a "Flat outlet", i.e. same information but
  // in a different format, a "flat" object, instead of nested.
  // We set that flat outlet into the context so it gets reflected
  // reflects on the screen.
  // We also write the flatoutlet to the storage so it gets picked up next time app starts.
  const menuPlansForOutlet = await DeviceStorage.readOutletMenuPlans(
    newOutletId
  );
  assertObject(menuPlansForOutlet, 'menuPlansForOutlet is not an object');

  let currentOutlet = Outlet.createFromServerResponse(menuPlansForOutlet);
  const orderedMenusFromThisOutlet = (
    selectedMenuPlans.find(x => x.outletId === newOutletId) || { menus: null }
  ).menus;

  if (mergeMenuPlans) {
    currentOutlet = currentOutlet.mergedMenuPlans(
      orderedMenusFromThisOutlet,
      date
    );
    currentOutlet = currentOutlet.flattened(orderedMenusFromThisOutlet, date);
  } else {
    currentOutlet = currentOutlet.flattened(orderedMenusFromThisOutlet, date);
    // drop any menu plans/recipes that have expired:
    currentOutlet = flatOutletWithoutExpiredMenuPlans(currentOutlet, date);
  }
  refresherService.saveCurrentFlatOutlet(currentOutlet, recipesContext);
}

export default function OutletSelector({ }) {
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

  const outletLabel = (o, outletNameOverrides) => {
    let name = '';
    if (outletNameOverrides[o.id] && outletNameOverrides[o.id].length > 0) {
      name = outletNameOverrides[o.id];
    } else {
      name = o.name;
    }
    return name;
  };

  return (
    <AdminContext.Consumer>
      {({
        selectedOutlets,
        outletNameOverrides,
        outletSettings,
        selectedMenuPlans
      }) =>
        (() => {
          const selectedOutletsWithMenuPlans = (selectedOutlets || []).filter(
            o => hasMenuPlans(o.id, selectedMenuPlans) && o.hasData
          );

          return (
            <View style={styles.container}>
              {hasItems(selectedOutletsWithMenuPlans) &&
                selectedOutletsWithMenuPlans.length > 1 ? (
                <View style={styles.containerInner}>
                  <Picker
                    mode="dropdown"
                    selectedValue={
                      menuContext && menuContext.data && menuContext.data.outlet
                    }
                    style={styles.picker}
                    textStyle={{ fontSize: 60 }}
                    itemStyle={styles.pickerItem}
                    onValueChange={(itemValue, itemIndex) => {
                      onOutletChanged(
                        itemValue,
                        refresherService,
                        outletSettings[itemValue] &&
                        outletSettings[itemValue].merged,
                        selectedMenuPlans,
                        recipesContext,
                        adminContext
                      );
                    }}>
                    {selectedOutletsWithMenuPlans.map((o, idx) => {
                      return (
                        <Picker.Item
                          key={`${o.id}-${idx}`}
                          label={`${outletLabel(o, outletNameOverrides)}`}
                          value={o.id}
                          style={styles.pickerItem}
                        />
                      );
                    })}
                  </Picker>
                </View>
              ) : null}
            </View>
          );
        })()
      }
    </AdminContext.Consumer>
  );
}

// Note: fontFamily here is _not_ working.
// See this: https://stackoverflow.com/questions/38921492/how-to-style-the-standard-react-native-android-picker/39141949#39141949
// And this: https://stackoverflow.com/questions/13703233/style-android-spinner
// Apparently this is only possible in android by ejecting.

const styles = StyleSheet.create({
  container: {
    height: 50,
    // backgroundColor: 'green',
    marginLeft: 30,
    fontFamily: 'nunito-bold'
  },
  containerInner: {
    borderBottomColor: theme.dark,
    borderBottomWidth: 1,
    width: 280,
    fontFamily: 'nunito-bold'
  },
  picker: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    marginLeft: 20,
    color: theme.dark,
    fontFamily: 'nunito-bold'
    // fontSize: 18
    // backgroundColor: 'white'
  },
  pickerItem: {
    fontFamily: 'nunito-bold'
  },
  pickerStyle: {
    color: theme.white,
    fontFamily: 'nunito-bold'
  }
});
