/* eslint-disable prefer-template */
import React, { useEffect, useState, useMemo, useContext } from 'react';
import { View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Text, CheckBox, Button } from 'react-native-elements';
import axios from 'axios';
import { uniqBy } from 'ramda';
import AdminHeader from '../../components/adminHeader';
import styles from './styles';
import AdminBottom from '../../components/adminBottom';
import AdminPageIndicator from '../../components/adminPageIndicator';
import theme from '../../styles/theme.style';
import AdminContext from '../../context/AdminContext';
import OutletName from '../../components/outletName';
import BackButton from '../../components/buttons/BackBtn';
import { menuPlansURL } from '../../../config/urls';
import Logger from '../../services/Logger';
import GenericOkCancelPopup from '../../components/popups/genericOkCancel';
import { bubbleDown, bubbleUp, byOrder } from '../../utils/array-utils';
import { injectOrderProperty } from './utils';
import { prepareRequestHeaders } from '../../utils/object-utils';
import buildK from '../../utils/request-utils';

// Preamble
// --------
// This screen allows the user to select which menu plans are configured
// in the tablet.
//
// This is what selectedMenuPlansLocal looks like with 2 menu plans
// selected:
// [{"outletId":"G20202","menus":[{"menuId":"180318940","menuName":"Menu plan 1"},{"menuId":"180318942","menuName":"Menu plan 2"}]}]
// You may also see a .order under each menu. This defines the relative order of the menus
//

const logger = Logger.getLogger();

/**
 * Custom hook that fetches menu plans for the given outletIds.
 * Returns an array of objects where each object has:
 * {outletId: x, menuPlans: [...]}
 * @param {Object} params
 */
function useFetch(params, adminContext) {
  const [data, setData] = useState(null);
  const array = [];

  function pushOutletToArray(outletMenuPlans) {
    array.push(outletMenuPlans);
    if (params.outletIds.length === array.length) {
      setData(sortedByUserSettings(array, adminContext.selectedMenuPlans));
    }
  }

  useEffect(() => {
    async function fetching(outletId) {
      const url = menuPlansURL.url.replace('%outletId', outletId);
      const headers = prepareRequestHeaders(
        {
          Authorization: adminContext.authCode,
          'content-type': 'application/json'
        },
        buildK()
      );
      logger.traceRequest(url, 'GET', null, null /* ,headers */);
      try {
        const response = await axios({
          method: 'GET',
          url,
          headers
        });
        console.log('DEV RAW RESPONSE for', outletId, ':', JSON.stringify(response.data)); // ← ADD
        const { list } = response.data;
        console.log('DEV list value:', JSON.stringify(list)); // ← ADD
        if (!data) {
          pushOutletToArray({ outletId, menuPlans: list });
        }
      } catch (error) {
        console.log('DEV ERROR STATUS:', error.response?.status); // ← ADD
        console.log('DEV ERROR BODY:', JSON.stringify(error.response?.data)); // ← ADD
        logger.trace(
          'adminMenuPlans',
          `useFetch: Got an error: ${JSON.stringify(error)}`
        );
        pushOutletToArray({ outletId, menuPlans: [] });
      }
    }

    params.outletIds.map((outlet, index) => fetching(outlet.id, index));
  }, [params]);

  if (data) {
    return data;
  }
  return null;
}

/**
 * Sorts the menu plans inside the `outlets` array according to the order
 * defined in the `selectedMenuPlans`
 *
 * The shape of the selectedMenuPlans is for example:
 *
 * [{"outletId":"G20202",
 *   "menus":[{"menuId":"180318940","menuName":"Menu plan 1", order:0},
 *            {"menuId":"180318942","menuName":"Menu plan 2", order: 1}]}]
 * (order may or may not be there)
 *
 * outlets is for example:
 * [{outletId:x, menuPlans:[{planId: y, description}]}]
 *
 * They are matched by planId = menuId.
 *
 * Note: there may be menus in outlets that do not exist in selectedMenuPlans
 *
 * Modifies the outlets array in place.
 *
 * @param {Array} outlets array of outlets, output of useFetch above
 * @param {Array} selectedMenuPlans array of objects
 */
function sortedByUserSettings(outlets, selectedMenuPlans) {
  if (!Array.isArray(outlets) || !Array.isArray(selectedMenuPlans)) {
    return outlets;
  }
  selectedMenuPlans.forEach(selectedMenuPlan => {
    const correspondingOutlet = outlets.find(
      o => o.outletId === selectedMenuPlan.outletId
    );
    // Note: there may be items in `outlets` that do not exist in `selectedMenuPlans`
    // Note: there may be menus in selectedMenuPlan.menus that don't exist in
    // correspondingOutlet.menuPlans (for example if they were deleted on the server)

    if (correspondingOutlet) {
      let selectedMenus = [...selectedMenuPlan.menus];

      // remove selectedMenus that do not exist in the server structure.
      // ADO-22744 there may be updates in the source for a selected menu plan that is not updated in the selectedMenuPlans
      selectedMenus = selectedMenuPlan.menus.map(menu => {
        const menuUpdated = getUpdatedMenu(menu, correspondingOutlet.menuPlans);
        return menuUpdated
          ? { ...menu, menuName: menuUpdated.description }
          : menu;
      });

      selectedMenus = selectedMenus.map(m => {
        if (
          (correspondingOutlet.menuPlans || []).find(
            mp => mp.planId === m.menuId
          )
        ) {
          return m;
        }
        return null;
      });
      selectedMenus = selectedMenus.filter(m => m); // removes nulls
      const sortedMenus = selectedMenus.sort(byOrder);
      selectedMenuPlan.menus = [...selectedMenus];

      // grab the existing menus in outlets.
      const serverMenus = correspondingOutlet.menuPlans || [];
      // replace them with the sorted menus from selectedMenuPlans
      correspondingOutlet.menuPlans = sortedMenus.map(m => ({
        planId: m.menuId,
        description: m.menuName
      }));
      // add the original ones to the end
      correspondingOutlet.menuPlans = [
        ...correspondingOutlet.menuPlans,
        ...serverMenus
      ];
      // make sure we remove repeated because there may be some.
      correspondingOutlet.menuPlans = uniqBy(
        x => x.planId,
        correspondingOutlet.menuPlans
      );
    }
  });
  return outlets;
}

function getUpdatedMenu(menu, menuList) {
  return menuList.find(menuListItem => menuListItem.planId === menu.menuId);
}

function renderMergeMenuPlansOption(
  outletId,
  outletSettings,
  setOutletSettings
) {
  return (
    <CheckBox
      key="Merge-checkbox"
      title="Merge into a single menu plan"
      textStyle={styles.checkOptionTextStyle}
      containerStyle={styles.allergenCheckbox}
      checked={outletSettings[outletId] && outletSettings[outletId].merged}
      iconType="material-community"
      checkedIcon="check-box-outline"
      uncheckedIcon="checkbox-blank-outline"
      onPress={() => {
        setOutletSettings({
          ...outletSettings,
          [outletId]: {
            merged: !(
              outletSettings[outletId] && outletSettings[outletId].merged
            )
          }
        });
      }}
      checkedColor={theme.darkgray}
      uncheckedColor={theme.darkgray}
      enabled
    />
  );
}

/**
 * Render a button inside a container that allows a list
 * of 2 items to be swap the order of the items.
 * @param {*} menuPlans
 * @param {*} idx
 * @param {*} renderId
 * @param {*} setRenderId
 */
function renderSingleSwapButton(menuPlans, idx, renderId, setRenderId) {
  return menuPlans.length === 2 ? (
    <View style={styles.singleSwapButtonContainer}>
      <Button
        icon={{
          ...{
            name: 'sync',
            size: 25
          },
          ...styles.upDownButtonIcon
        }}
        buttonStyle={[styles.upDownButton, styles.singleSwapButton]}
        onPress={() => {
          bubbleUp(menuPlans, idx);
          setRenderId(renderId + 1);
        }}
      />
    </View>
  ) : null;
}

/**
 * Renders 2 buttons Up/Down that allows a menu plan to be moved
 * up or down in a list respectively. Only if the list (menuplans)
 * has more than 2 items.
 * @param {*} menuPlans
 * @param {*} idx
 * @param {*} sortedMenuPlans
 * @param {*} renderId
 * @param {*} setRenderId
 */
function renderOrderButtons(
  menuPlans,
  idx,
  sortedMenuPlans,
  renderId,
  setRenderId
) {
  if (menuPlans.length >= 3) {
    return (
      <>
        <Button
          icon={{
            ...{
              name: 'keyboard-arrow-down',
              size: 25
            },
            ...styles.upDownButtonIcon
          }}
          buttonStyle={[styles.upDownButton, styles.downButton]}
          onPress={() => {
            bubbleDown(sortedMenuPlans, idx);
            setRenderId(renderId + 1);
          }}
        />
        <Button
          icon={{
            ...{
              name: 'keyboard-arrow-up',
              size: 25
            },
            ...styles.upDownButtonIcon
          }}
          buttonStyle={[styles.upDownButton, styles.upButton]}
          onPress={() => {
            bubbleUp(sortedMenuPlans, idx);
            setRenderId(renderId + 1);
          }}
        />
      </>
    );
  }
  return null;
}

/**
 * MenuPlans screen component.
 * @param {Object} param0
 */
export default function MenuPlans({ navigation }) {
  const adminContext = useContext(AdminContext);
  // Declare selectedMenuPlansLocal.
  // This is an array that
  // keeps the outlets and menuplans that are selected. If no checks on screen
  // then this array is empty. With two menuPlans selected it looks like this:
  // [{"outletId":"G20202","menus":[{"menuId":"180318940","menuName":"Menu plan 1"},{"menuId":"180318942","menuName":"Menu plan 2"}]}]
  // In reality it should be an Object, using the outletId as a key and mapping to objects which have
  // the menuId as key. Because it is an array instead, there is a bit too much code
  // to manage this array, namely to remove/add entries.
  // However, this is not trivial to change because it matches the same structure
  // as the adminContext.selectedMenuPlans. For now it stays as is, since it works.
  // See function `manageValues`, `outletExistsInSelectedMenuPlansLocal`
  const [selectedMenuPlansLocal, setSelectedMenuPlansLocal] = useState(
    adminContext.selectedMenuPlans.length > 0
      ? adminContext.selectedMenuPlans
      : []
  );
  const [namePopupVisible, setNamePopupVisible] = useState(false); // true when the edit name popup is open
  const [outletInEdit, setOutletInEdit] = useState({ id: null, name: '' });
  const [renderId, setRenderId] = useState(0); // used to force a rerender
  const props = { outletIds: adminContext.selectedOutlets };
  const params = useMemo(() => ({ outletIds: props.outletIds }), [
    props.outletIds
  ]);
  // Fetch a list of menuplans for each outlet under `outlets`
  const outlets = useFetch(params, adminContext);

  // Make sure our selectedMenuPlansLocal does not have menu plans
  // that no longer exist in the server. When it does, they are removed from
  // selectedMenuPlansLocal. `outlets` is what comes from the server.
  // Defect: ADO-9731
  useEffect(() => {
    if (outlets) {
      const newSelectedMenuPlansLocal = selectedMenuPlansLocal
        .map(m => {
          const correspondingOutletInOutlets = outlets.find(
            o => o.outletId === m.outletId
          );
          if (correspondingOutletInOutlets) {
            const selectedMenusExistingInOutlets = m.menus
              .map(menu => {
                if (
                  (correspondingOutletInOutlets.menuPlans || []).find(
                    x => x.planId === menu.menuId
                  )
                ) {
                  return menu;
                }
                // else
                return null;
              })
              .filter(m1 => m1); // filters out nulls.
            return { ...m, menus: selectedMenusExistingInOutlets };
          }
          // else: this outlet in selected doesn't even exist in server
          return null;
        })
        .filter(m2 => m2); // filter out nulls

      setSelectedMenuPlansLocal(newSelectedMenuPlansLocal);
    }
  }, [outlets]);

  /**
   *
   * @param {*} outletId
   */
  const outletExistsInSelectedMenuPlansLocal = outletId => {
    let exists = false;
    selectedMenuPlansLocal.forEach(element => {
      if (element.outletId === outletId) exists = true;
    });
    return exists;
  };

  /**
   *
   * @param {*} menus
   * @param {*} menuId
   */
  const menuExists = (menus, menuId) => {
    return menus.find(m => m.menuId === menuId) !== undefined;
  };

  /**
   *
   * @param {*} menuPlans
   */
  const hasSelectedMenu = menuPlans => {
    let exists = [];

    menuPlans.forEach(outlet => {
      if (outlet.menus.length > 0) exists = outlet.menus;
    });
    return exists;
  };

  /**
   *
   * @param {*} menuId
   * @param {*} outletId
   */
  const isChecked = (menuId, outletId) => {
    return (
      selectedMenuPlansLocal.find(
        e => e.outletId === outletId && menuExists(e.menus, menuId)
      ) !== undefined
    );
  };

  /**
   *
   * @param {*} menuId
   * @param {*} outletId
   * @param {*} menuName
   */
  const manageValues = (menuId, outletId, menuName) => {
    const duplicate = selectedMenuPlansLocal;
    let menus = [];
    // Take selectedMenuPlansLocal and keep only the menu plans for other outlets.
    const without = duplicate.filter(element => element.outletId !== outletId);

    duplicate.map(element => {
      if (element.outletId === outletId) {
        if (menuExists(element.menus, menuId)) {
          return (menus = element.menus.filter(menu => menu.menuId !== menuId));
        } else {
          menus = [...element.menus, { menuId, menuName }];
          return (element.menus = [...element.menus, menuId]);
        }
      }
    });

    return outletExistsInSelectedMenuPlansLocal(outletId)
      ? setSelectedMenuPlansLocal([...without, { outletId, menus }])
      : setSelectedMenuPlansLocal([
          ...selectedMenuPlansLocal,
          { outletId, menus: [{ menuId, menuName }] }
        ]);
  };

  const clickHandler = (menuId, outletId, menuName) => () => {
    manageValues(menuId, outletId, menuName);
  };

  const mapIdToOutlet = outletId => {
    const outlet = adminContext.selectedOutlets.find(
      outlet => outlet.id === outletId
    );
    return outlet;
  };

  /**
   * nextHandler: Called when the user presses the Next button
   * at the bottom.
   * Copies the local version of selectedMenuPlans into the
   * adminContext.
   * The shape of the selectedMenuPlansLocal is for example:
   *
   * [{"outletId":"G20202",
   *   "menus":[{"menuId":"180318940","menuName":"Menu plan 1"},
   *            {"menuId":"180318942","menuName":"Menu plan 2"}]}]
   *
   * Before we copy though, we need to inject order information.
   * The order of the menu plans is kept in `outlets` inside each .menuPlans
   * function `injectOrderProperty` can do this.
   */
  const nextHandler = () => {
    injectOrderProperty(outlets, selectedMenuPlansLocal);
    adminContext.setSelectedMenuPlans(selectedMenuPlansLocal);
    navigation.navigate('AdminSummary');
  };

  return (
    <AdminContext.Consumer>
      {({
        setSelectedMenuPlans,
        outletNameOverrides,
        setOutletNameOverrides,
        outletSettings,
        setOutletSettings
      }) => (
        <View style={styles.container}>
          <AdminHeader />
          <View style={styles.titleContainer}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={styles.title}>
              Select Menu Plan(s) for selected Outlets
            </Text>
            {/* Dummy element so title is centered */}
            <View style={styles.dummy} />
          </View>

          <AdminPageIndicator active={'MenuPlans'} />
          <Text style={styles.subtitle}>
              Click on '^' or '˅' arrows to change the order of menu plans up or down.
            </Text>
            {/* <Text style={styles.subtitle}>
              Click on <Button icon={{...{name: 'keyboard-arrow-down',size: 20}}} buttonStyle={[styles.upDownButton, styles.menuPlanSubTitleButton]}/> or 
              <Button icon={{...{name: 'keyboard-arrow-down',size: 20}}} buttonStyle={[styles.upDownButton, styles.menuPlanSubTitleButton]}/> arrows to change the order of menu plans up or down.
            </Text> */}
          <ScrollView style={{ width: '100%' }}>
            {outlets &&
              outlets
                .sort((o1, o2) => o1.outletId.localeCompare(o2.outletId))
                .map(outletBeingRendered => (
                  <View key={outletBeingRendered.outletId}>
                    <View style={styles.option}>
                      <View style={styles.outletText}>
                        {(() => {
                          const outlet = mapIdToOutlet(
                            outletBeingRendered.outletId
                          );
                          return (
                            <>
                              <GenericOkCancelPopup
                                height={250}
                                visible={namePopupVisible}
                                okText="Change name"
                                outletId={outletBeingRendered.outletId}
                                handleOk={() => {
                                  const overrides = {
                                    ...outletNameOverrides,
                                    [outletInEdit.id]: outletInEdit.name
                                  };
                                  setOutletNameOverrides(overrides);
                                  setNamePopupVisible(false);
                                }}
                                handleCancel={() => {
                                  setNamePopupVisible(false);
                                }}>
                                <TextInput
                                  autoFocus
                                  style={styles.editNameInput}
                                  onChangeText={text => {
                                    setOutletInEdit({
                                      ...outletInEdit,
                                      name: text
                                    });
                                  }}
                                  value={outletInEdit.name}
                                />
                              </GenericOkCancelPopup>
                              <OutletName
                                outletId={outletBeingRendered.outletId}
                                originalName={outlet && outlet.name}
                                name={
                                  outletNameOverrides[
                                    outletBeingRendered.outletId
                                  ] ||
                                  (outlet && outlet.name)
                                }
                                onFocus={() => {
                                  setOutletInEdit({
                                    id: outletBeingRendered.outletId,
                                    name:
                                      outletNameOverrides[
                                        outletBeingRendered.outletId
                                      ] || outlet.name
                                  });
                                  setNamePopupVisible(true);
                                }}
                                editable
                              />
                            </>
                          );
                        })()}
                      </View>
                      {outletBeingRendered.menuPlans &&
                      outletBeingRendered.menuPlans.length > 0 ? (
                        <View style={{ width: '45%', flexDirection: 'column' }}>
                          <View style={{ flexDirection: 'row' }}>
                            {/* Render vertical list of menu plan buttons: */}
                            <View
                              style={{
                                flexDirection: 'column'
                              }}>
                              {outletBeingRendered.menuPlans.map(
                                (menu, idx, sortedMenuPlans) => (
                                  <View
                                    key={menu.planId}
                                    style={styles.menuPlanOrderContainer}>
                                    <TouchableOpacity
                                      onPress={clickHandler(
                                        menu.planId,
                                        outletBeingRendered.outletId,
                                        menu.description
                                      )}
                                      activeOpacity={0.7}
                                      key={menu.planId}
                                      style={[
                                        styles.menu,
                                        idx ===
                                        outletBeingRendered.menuPlans.length - 1
                                          ? styles.menuLast
                                          : {},
                                        isChecked(
                                          menu.planId,
                                          outletBeingRendered.outletId
                                        )
                                          ? styles.selected
                                          : {}
                                      ]}>
                                      <Text style={styles.boldText}>
                                        {menu.description}
                                      </Text>
                                      <CheckBox
                                        containerStyle={styles.allergenCheckbox}
                                        checked={isChecked(
                                          menu.planId,
                                          outletBeingRendered.outletId
                                        )}
                                        iconType="material-community"
                                        checkedIcon="check-box-outline"
                                        uncheckedIcon="checkbox-blank-outline"
                                        onPress={clickHandler(
                                          menu.planId,
                                          outletBeingRendered.outletId,
                                          menu.description
                                        )}
                                        checkedColor={theme.darkgray}
                                        uncheckedColor={theme.darkgray}
                                      />
                                    </TouchableOpacity>
                                    {/* 
                                      Change order buttons. If only 1 menu plan -> no button
                                      If 2 display a swap button, 3 or more -> Up/down buttons on each 
                                    */}
                                    {renderOrderButtons(
                                      outletBeingRendered.menuPlans,
                                      idx,
                                      sortedMenuPlans,
                                      renderId,
                                      setRenderId
                                    )}
                                  </View>
                                )
                              )}
                            </View>
                            {/* If only 2 menu plans we put a single button
                             to swap their order */}
                            {renderSingleSwapButton(
                              outletBeingRendered.menuPlans,
                              0,
                              renderId,
                              setRenderId
                            )}
                          </View>
                          {/* Option to merge menuplans for this outlet */}
                          {renderMergeMenuPlansOption(
                            outletBeingRendered.outletId,
                            outletSettings,
                            setOutletSettings
                          )}
                        </View>
                      ) : (
                        <Text style={styles.noMenuPlans}>
                          No menu plans for this outlet
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
          </ScrollView>
          <AdminBottom
            outlets={hasSelectedMenu(selectedMenuPlansLocal)}
            navigation={navigation}
            nextHandler={nextHandler}
            proceedButtonText="Next"
            saveOutlets={menus => setSelectedMenuPlans(menus)}
          />
        </View>
      )}
    </AdminContext.Consumer>
  );
}
