/* eslint-disable camelcase */
import range from 'lodash/range';
import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import theme from '../../styles/theme.style';
import MenuContext from '../../context/MenuContext';
import RecipesContext from '../../context/RecipesContext';
import {
  filterRecipesFromSelections,
  filterDayPartsFromMenuPlans
} from '../../utils/display';
import { assertIsArray } from '../../utils/assertions';

/**
 *
 * @param {*} param0
 */
export default function MenuItems({ selectedMenuPlanIds }) {
  const [initialized, setInitialized] = useState(false);
  const [activeMenus, setActiveMenu] = useState([]);
  const { data } = useContext(MenuContext);
  const recipesContext = useContext(RecipesContext);
  let newMenuPlans;

  assertIsArray(selectedMenuPlanIds);

  useEffect(() => check(), [selectedMenuPlanIds]);

  const check = () => {
    if (selectedMenuPlanIds.length != activeMenus.length) {
      setActiveMenu(range(0, selectedMenuPlanIds.length));
    }
    // Make sure all menu items are preselected by default
    if (!initialized) {
      const ids = data.menu_plans.map(p => p.id);
      if (ids.length > 0) {
        recipesContext.setSelectedMenuPlanIds(ids);
        setActiveMenu(range(0, ids.length));
        setInitialized(true);
      }
    }
  };

  const updateIndex = selectedIndex => {
    const exists = activeMenus.includes(selectedIndex);
    if (exists) {
      if (activeMenus.length <= 1) {
        return; // Do not allow last one to be deselected
      }
      const newArr = activeMenus.filter(value => value !== selectedIndex);
      setActiveMenu(newArr);
      newMenuPlans = (selectedMenuPlanIds || []).filter(
        id => id !== data.menu_plans[selectedIndex].id
      );
      recipesContext.setSelectedMenuPlanIds(newMenuPlans);
    } else {
      setActiveMenu([...activeMenus, selectedIndex]);
      newMenuPlans = [
        ...selectedMenuPlanIds,
        data.menu_plans[selectedIndex].id
      ];
      recipesContext.setSelectedMenuPlanIds(newMenuPlans);
    }
    const visibleRecipes = filterRecipesFromSelections(
      { selectedMenuPlanIds: newMenuPlans },
      recipesContext
    );

    filterDayPartsFromMenuPlans(
      {
        selectedMenuPlanIds: newMenuPlans,
        dayParts: data.day_parts,
        visibleRecipes
      },
      recipesContext
    );
  };

  const bottomColor = index => {
    const menuColors = [
      theme.yellow,
      theme.green,
      theme.purple,
      theme.red,
      theme.dark
    ];
    return {
      borderBottomColor: menuColors[index % menuColors.length]
    };
  };

  return (
    <MenuContext.Consumer>
      {({ data }) => (
        <View style={styles.container}>
          {data.menu_plans.length > 1 &&
            data.menu_plans.map((menu, index) => (
              <View
                key={`${menu.id}-${index}`}
                style={[styles.wrapper, bottomColor(index)]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => updateIndex(index)}
                  style={
                    index > 0 ? [styles.menu, styles.borderLeft] : [styles.menu]
                  }>
                  {activeMenus.includes(index) ? (
                    <View style={styles.menuActive}>
                      <Text style={styles.active}>{menu.description}</Text>
                      <Icon
                        containerStyle={styles.iconStyle}
                        name="done"
                        size={18}
                        color="black"
                      />
                    </View>
                  ) : (
                    <Text style={styles.inactive}>{menu.description}</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
        </View>
      )}
    </MenuContext.Consumer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    height: 50,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    overflow: 'hidden', // Prevent overflow outside the containe
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: '#979797'
  },
  wrapper: {
    // flex: 0.26,
    // minWidth: 260,
    // maxWidth: 400,
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: theme.white,
    justifyContent: 'center',
    borderBottomWidth: 4,
    overflow: 'scroll', // Ensure no content spills outside,
    

  },
  menu: {
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  active: {
    alignSelf: 'center',
    fontSize: 14,
    // fontWeight: 'bold',
    fontFamily: 'nunito-extra-bold',
    color: theme.darkgray,
  },
  inactive: {
    flexDirection: 'row',
    alignSelf: 'center',
    fontSize: 14,
    color: theme.gray2,
    fontFamily: 'nunito-medium',
  },
  menuActive: {
    flexDirection: 'row'
  },
  iconStyle: {
    marginLeft: 2,
    justifyContent: 'center'
  }
});
