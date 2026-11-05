/* eslint-disable no-nested-ternary */
import React, { useState, useContext, useRef } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import flatten from 'ramda/src/flatten';
import { Text } from 'react-native-elements';
import RecipesContainer from '../../components/recipesContainer';
import MenuItems from '../../components/menuItems';
import DayParts from '../../components/dayparts';
import AdminContext from '../../context/AdminContext';
import RecipesContext from '../../context/RecipesContext';
import MenuContext from '../../context/MenuContext';
import {
  shouldDisplayRecipePricesForOutlet,
  uniqueRecipesById
} from '../../utils/display';
import NoResults from '../../components/noResults';
import Welcome from '../../components/welcome';
import SearchTitle from '../../components/searchTitle';
import OutletSelector from '../../components/outletSelector';
import BackToTopButton from '../../components/buttons/BackToTop';
import { groupByPropertyValue } from '../../utils/array-utils';
import { hasMenuPlans } from '../../domain/Outlet';

/**
 *
 */
export default function HomeScreen({ navigation }) {
  const [displayBackToTop, setDisplayBackToTop] = useState(false);
  const menuContext = useContext(MenuContext);
  const scrollRef = useRef();
  const data = menuContext.data;

  function onScroll({ nativeEvent }) {
    setDisplayBackToTop(nativeEvent.contentOffset.y > 20);
  }

  function recipesToShow(visibleRecipes, visibleDayParts) {
    // split the recipes per day part
    const recipesPerDayPart = visibleDayParts.map(dayPart =>
      uniqueRecipesById(visibleRecipes).filter(
        recipe => recipe.day_part === dayPart.id
      )
    );
    return recipesPerDayPart.reduce((acc, val) => val.length + acc, 0) > 0;
  }

  /**
   * Note: For the moment this function is not used.
   * See recipesMergedOrWelcomeScreen.
   * @param {*} visibleRecipes
   * @param {*} visibleDayParts
   * @param {*} selectedOutlets
   */
  function recipesOrWelcomeScreen(
    visibleRecipes,
    visibleDayParts,
    selectedOutlets
  ) {
    //
    if (!selectedOutlets || selectedOutlets.length === 0) {
      return <Welcome navigation={navigation} />;
    }
    if (recipesToShow(visibleRecipes, visibleDayParts)) {
      return visibleDayParts.map(dayPart => {
        const recipesForDayPart = uniqueRecipesById(visibleRecipes).filter(
          recipe => recipe.day_part === dayPart.id
        );
        return recipesForDayPart.length > 0 ? (
          <RecipesContainer
            key={dayPart.id}
            navigation={navigation}
            recipesData={recipesForDayPart}
            dayPart={dayPart.description}
          />
        ) : null;
      });
    }
    // else:
    return <NoResults />;
  }

  function exemptOutlets(selectedOutletId, selectedOutlets) {
    const expemtOutlet = selectedOutlets.find(o => o.id === selectedOutletId);
    if (expemtOutlet && expemtOutlet.exempt) {
      return expemtOutlet.exempt;
    }
  }

  /**
   * recipesMergedOrWelcomeScreen.
   * When the device is not configured, return the welcome screen
   * else return recipes grouped by day part description.
   * @param {*} visibleRecipes
   * @param {*} visibleDayParts
   * @param {Array} selectedOutlets Array with { id,name, hidePrices, currency }
   * @param {String} selectedOutletId String with the ID of the current outlet
   */
  function recipesMergedOrWelcomeScreen(
    visibleRecipes,
    visibleDayParts,
    selectedOutlets,
    selectedOutletId
  ) {
    //
    if (!selectedOutlets || selectedOutlets.length === 0) {
      return <Welcome navigation={navigation} />;
    }
    if (recipesToShow(visibleRecipes, visibleDayParts)) {
      // group day parts by description
      const dayPartsGroupedByDesc = groupByPropertyValue(
        visibleDayParts,
        'description'
      );
      return Object.keys(dayPartsGroupedByDesc)
        .filter(item => item !== '')
        .map(dayPartDesc => (
          <RecipesContainer
            key={dayPartDesc}
            navigation={navigation}
            // recipesData are the recipes of the dayParts with name `dayPartDesc`
            // We need to remove duplicates because same recipe can be twice, from
            // different day parts.
            recipesData={uniqueRecipesById(
              flatten(
                (dayPartsGroupedByDesc[dayPartDesc] || []).map(dp => {
                  const recipesForDayPart = visibleRecipes.filter(
                    recipe => recipe.day_part === dp.id
                  );
                  return recipesForDayPart;
                })
              )
            )}
            dayPart={dayPartDesc}
            showPrices={shouldDisplayRecipePricesForOutlet(
              selectedOutletId,
              selectedOutlets
            )}
            exempt={exemptOutlets(selectedOutletId, selectedOutlets)}
          />
        ));
    }
    // else:
    return <NoResults />;
  }

  function exemptOutletStaticText(selectedOutletsWithMenuPlans) {
    if (menuContext && menuContext.data && menuContext.data.outlet) {
      const selectedOutlet = selectedOutletsWithMenuPlans.find(o => o.id === menuContext.data.outlet);
      if (selectedOutlet && selectedOutlet.exempt) {
        return selectedOutlet.exempt;
      }
    }
  }

  return (
    <View style={styles.container}>
      <AdminContext.Consumer>
        {({ selectedOutlets, selectedMenuPlans }) => {
          const selectedOutletsWithMenuPlans = (
            selectedOutlets || []
          ).filter(o => hasMenuPlans(o.id, selectedMenuPlans));
          return (
            <>
              {!exemptOutletStaticText(selectedOutletsWithMenuPlans) ? (
                data.menu_plans.length > 0 && selectedOutletsWithMenuPlans.length > 0 ?
                  (<Text style={styles.caloriesWarning}>
                    Adults need around 2000 kcal a day
                  </Text>) : null
                ) : null}
              <BackToTopButton
                display={displayBackToTop}
                scrollViewRef={scrollRef}
              />
              <ScrollView
                ref={ref => {
                  scrollRef.current = ref;
                }}
                scrollEventThrottle={200}
                onScroll={onScroll}>
                <RecipesContext.Consumer>
                  {({
                    visibleRecipes,
                    visibleDayParts,
                    searchQueryFilter,
                    selectedMenuPlanIds
                  }) => (
                    <MenuContext.Consumer>
                      {({ data }) => (
                        <View>
                          {/* Render an optional outlet selector if more than 1 outlet
                          and menu plans buttons if more than 1. If both non existent, then
                          don't render an empty row: */}
                          {!data.menu_plans || data.menu_plans.length < 1 || (selectedOutletsWithMenuPlans.length <= 1 &&
                            data.menu_plans.length < 2) ? null : (
                            <View style={styles.outletMenuPlansContainer}>
                              {/* Outlet selector: Hidden if only 1 outlet */}
                              {selectedOutletsWithMenuPlans.length > 1 ? (
                                <View style={styles.outletSelectorContainer}>
                                  <OutletSelector />
                                </View>
                              ) : null}

                              {/* The menu plan buttons container with a scroll in case of a lot of them */}
                              <View
                                style={[
                                  styles.menuItemsScrollViewContainer,
                                  selectedOutletsWithMenuPlans.length <= 1
                                    ? styles.menuItemsScrollViewContainerFullW
                                    : null
                                ]}>
                                <ScrollView horizontal>
                                  <MenuItems
                                    selectedMenuPlanIds={selectedMenuPlanIds}
                                  />
                                </ScrollView>
                              </View>

                              {/* A dummy item that only appears if the outlet selector appears and there are less than 2 menu plans (to center them) */}
                              <View
                                style={[
                                  styles.dummy,
                                  selectedOutletsWithMenuPlans.length > 1 &&
                                    data.menu_plans.length <= 2
                                    ? styles.dummyCenter
                                    : null
                                ]}
                              />
                            </View>
                          )}
                          {/*  */}
                          <DayParts
                            navigation={navigation}
                            itemsPerInterval={6}
                            items={visibleDayParts}
                          />
                          {searchQueryFilter.length > 0 && (
                            <SearchTitle
                              searchQueryFilter={searchQueryFilter}
                            />
                          )}
                          {recipesMergedOrWelcomeScreen(
                            visibleRecipes,
                            visibleDayParts,
                            selectedOutlets,
                            data.outlet
                          )}
                        </View>
                      )}
                    </MenuContext.Consumer>
                  )}
                </RecipesContext.Consumer>
              </ScrollView>
            </>
          );
        }}
      </AdminContext.Consumer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#F2F6F8',
    paddingLeft: 20,
    paddingRight: 20,
    height: '100%'
  },
  outletMenuPlansContainer: {
    marginTop: 30,
    marginBottom: 0,
    flexDirection: 'row',
    elevation: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 0
  },
  outletSelectorContainer: {
    justifyContent: 'center',
    height: 50,
    marginRight: 'auto'
  },
  menuItemsScrollViewContainer: {
    maxWidth: '70%',
    marginHorizontal: 'auto',
    height: 50,
    padding: 0
  },
  menuItemsScrollViewContainerFullW: {
    width: '100%',
    maxWidth: '100%',
    flex: 1,
    margin: 'auto',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dummy: {
    marginLeft: 'auto',
    height: 50
  },
  dummyCenter: {
    width: 300
  },
  caloriesWarning: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'nunito-bold',
    paddingTop: 10
  }
});
