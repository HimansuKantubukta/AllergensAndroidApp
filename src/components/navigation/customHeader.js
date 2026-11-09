import React, { useState, useContext, useEffect, createRef } from 'react';
import Constants from 'expo-constants';
import { View, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Button, Icon, Text, Image } from 'react-native-elements';
import uniqBy from 'lodash/uniqBy';
import styles from './styles';
import Highlighter from '../highlighter';
import DietaryRequirements from '../dietaryRequirements';
import AllergenIcon from '../icons/AllergenIcon';
import RecipesContext from '../../context/RecipesContext';
import MenuContext from '../../context/MenuContext';
import AdminContext from '../../context/AdminContext';
import {
  shouldDisplayRecipePricesForOutlet,
  filterRecipesFromSelections,
  filterDayPartsFromMenuPlans,
  uniqueRecipes
} from '../../utils/display';
import { getCurrentRoute } from './navigationHelper';
import DateText from '../../utils/date';
import theme from '../../styles/theme.style';
import Authentication from '../../services/Authentication';
// eslint-disable-next-line import/no-unresolved
const HomeIcon = require('../../../assets/icons/allergon_badge.png');
// eslint-disable-next-line import/no-unresolved
const SearchIcon = require('../../../assets/icons/white.png');

// constants
const ALLERGEN_ICON_WIDTH = 45;

export default function CustomHeader({ options, navigation, inactivityReset }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [value, setValue] = useState('');
  const [found, setFound] = useState([]);
  const recipesContext = useContext(RecipesContext);
  const { data } = useContext(MenuContext);
  const adminContext = useContext(AdminContext);
  const allMenus = data.menu_plans.map(mp => mp.id);

  const isExemptOutlet = exemptOutlets(data.outlet, adminContext.selectedOutlets);

  const onPressSearch = () => {
    setOpenSearch(true);
  };

  useEffect(() => {
    if (openSearch) {
      inputRef.current.focus();
    }
  }, [openSearch]);

  /**
   * Called when the app is inactive for too long.
   * Resets the state of the app.
   */
  const resetHandler = async () => {
    if (adminContext.authCode) {
      // if we have a session, we need to clear it.
      const logoutResult = await Authentication.logout();
      if (logoutResult) {
        adminContext.setAuthCode(null);
      }
    }

    // Aux function to call setSelected(false) on every item of array
    const clearAllergenSelections = allergensArray => {
      allergensArray.forEach(a => {
        if (a.subtypes) {
          clearAllergenSelections(a.subtypes);
        }
        if (a.setSelected) {
          a.setSelected(false);
        }
      });
    };
    setOpenSearch(false);
    setValue('');
    setFound([]);
    clearAllergenSelections(recipesContext.possibleAllergens); // clear may contains section selections
    clearAllergenSelections(recipesContext.allergens); // clear contains section selections
    recipesContext.resetFilters();
    filterDayPartsFromMenuPlans(
      {
        selectedMenuPlanIds: allMenus,
        dayParts: data.day_parts, // all day parts
        visibleRecipes: recipesContext.allRecipes
      },
      recipesContext
    );
    filterRecipesFromSelections(
      {
        selectedMenuPlanIds: allMenus,
        allergens: [],
        possibleAllergens: [],
        searchQueryFilter: '',
        excludeGFCereals: false
      },
      recipesContext
    );
    return navigation.navigate('Home');
  };

  // These two lines are responsible for resetting the app after a specified
  // amount of time has passed without activity.
  const resetInactivity = () => (inactivityReset ? resetHandler() : () => { });
  // useEffect(() => resetInactivity(), [inactivityReset]);

  useEffect(() => {
    resetInactivity();
  }, [inactivityReset]);

  const selectElement = element => () => {
    const singleRecipeID = found[element].id;
    setOpenSearch(false);
    setFound([]);
    setValue('');
    navigation.navigate('RecipeDetails', {
      id: singleRecipeID, 
      showPrice: shouldDisplayRecipePricesForOutlet(
        data.outlet,
        adminContext.selectedOutlets
      ),
      isExemptOutlet
    });

  };

  function exemptOutlets(selectedOutletId, selectedOutlets) {
    const expemtOutlet = selectedOutlets.find(o => o.id === selectedOutletId);
    if (expemtOutlet && expemtOutlet.exempt) {
      return expemtOutlet.exempt;
    }
  }



  const onChangeText = (recipes, text) => {
    let modifiedRecipes = recipes;
    if (text.length < 1) {
      const visibleRecipes = filterRecipesFromSelections(
        { searchQueryFilter: '' },
        recipesContext
      );
      filterDayPartsFromMenuPlans(
        { visibleRecipes, dayParts: data.day_parts },
        recipesContext
      );
      modifiedRecipes = visibleRecipes;
    }
    if (text.length < 3) {
      const escaped = text.replace(/[^A-Za-z0-9 ]+/g, '');
      setValue(escaped);
      setFound([]);
    } else {
      const escaped = text.replace(/[^A-Za-z0-9 ]+/g, '');
      const searchText = escaped.toLowerCase();
      setValue(escaped);
      const wordsFromSearch = searchText.trim().split(' ');
      let filteredData = [];
      for (let i = 0; i < wordsFromSearch.length; i++) {
        filteredData =
          i === 0
            ? modifiedRecipes.filter(item => {
              return (
                (item.longName || '')
                  .toLowerCase()
                  .includes(wordsFromSearch[i])
                //   ||
                // (item.ingredients || '')
                //   .toLowerCase()
                //   .includes(wordsFromSearch[i])
              );
            })
            : filteredData.filter(item => {
              return (
                (item.longName || '')
                  .toLowerCase()
                  .includes(wordsFromSearch[i])
                //   ||
                // (item.ingredients || '')
                //   .toLowerCase()
                //   .includes(wordsFromSearch[i])
              );
            });
        setFound(uniqBy(uniqueRecipes(filteredData), 'longName'));
      }
    }
  };

  const handleClearClick = () => {
    setValue('');
    setFound([]);
    const visibleRecipes = filterRecipesFromSelections(
      { searchQueryFilter: '' },
      recipesContext
    );
    filterDayPartsFromMenuPlans(
      { visibleRecipes, dayParts: data.day_parts },
      recipesContext
    );
    recipesContext.setSearchQueryFilter('');
    setOpenSearch(false);
  };

  const handleClear = () => {
    setValue('');
    setFound([]);
    const visibleRecipes = filterRecipesFromSelections(
      { searchQueryFilter: '' },
      recipesContext
    );
    filterDayPartsFromMenuPlans(
      { visibleRecipes, dayParts: data.day_parts },
      recipesContext
    );
  };

  const handleSubmit = () => {
    if (value.length > 2) {
      setValue(value);
      const visibleRecipes = filterRecipesFromSelections(
        { searchQueryFilter: value },
        recipesContext
      );
      filterDayPartsFromMenuPlans(
        { visibleRecipes, dayParts: data.day_parts },
        recipesContext
      );
      recipesContext.setSearchQueryFilter(value);
    } else {
      const visibleRecipes = filterRecipesFromSelections(
        { searchQueryFilter: '' },
        recipesContext
      );
      filterDayPartsFromMenuPlans(
        { visibleRecipes, dayParts: data.day_parts },
        recipesContext
      );
      recipesContext.setSearchQueryFilter('');
    }
    setOpenSearch(false);
    const route = getCurrentRoute();
    if (route.name === 'RecipeDetails') {
      navigation.navigate('Home');
    }
  };
  let inputRef;
  if (openSearch && !inputRef) {
    inputRef = createRef();
  }

  return (
    <RecipesContext.Consumer>
      {data => (
        <View style={[styles.headerContainer, options.headerStyle]}>
          <View style={styles.headerTopRow}>
            <DietaryRequirements
              visible={modalVisible}
              onSave={() => setModalVisible(false)}
              onClose={() => setModalVisible(false)}
            />
            <View style={styles.firstCol}>
              <TouchableOpacity
                onLongPress={() => navigation.navigate('AdminWrapper')}
                onPress={() => navigation.navigate('Home')}>
                <Image source={HomeIcon} style={styles.homeIcon} />
              </TouchableOpacity>
              <Text
                style={styles.homeText}
                onLongPress={() => navigation.navigate('AdminWrapper')}
                onPress={() => navigation.navigate('Home')}>
                Home
              </Text>
            </View>
            <View style={styles.secondCol}>
              <View style={styles.dummyReset} />
              <Button
                icon={<Icon name="add" color="white" />}
                buttonStyle={styles.dietaryReqsBtn}
                titleStyle={styles.buttonText}
                title="Add Allergen Requirements"
                onPress={() => {
                  setModalVisible(true);
                }}
              />

              <TouchableOpacity
                style={styles.resetContainer}
                onPress={resetHandler}>
                <Icon color={theme.offwhite} name="refresh" size={24} />
                <Text style={styles.reset}>Reset</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.thirdCol}>
              <View
                style={
                  openSearch ? styles.resultsContainer : { display: 'none' }
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    alignItems: 'center',
                    paddingHorizontal: 8
                  }}>
                  <Icon onPress={handleSubmit} name="search" color="black" />
                  <TextInput
                    ref={inputRef}
                    onSubmitEditing={handleSubmit}
                    placeholder="Recipe Search"
                    onChangeText={text =>
                      onChangeText(data.visibleRecipes, text)
                    }
                    value={value}
                    style={styles.input}
                  />
                  <Icon onPress={handleClear} name="close" color="black" />
                </View>
                {found.length > 0 && (
                  <View style={styles.flatList}>
                    <FlatList
                      keyboardShouldPersistTaps="always"
                      data={found && found.length > 0 ? found : []}
                      keyExtractor={item => `item-${item.id}-${item.longName}`}
                      renderItem={({ item, index }) => (
                        <Text
                          style={styles.listItem}
                          onPress={selectElement(
                            index,
                            data.setSearchQueryFilter
                          )}>
                          <Highlighter
                            highlightStyle={styles.bold}
                            searchWords={value.trim().split(' ')}
                            textToHighlight={item.longName}
                            autoEscape
                          />
                        </Text>
                      )}
                    />
                  </View>
                )}
              </View>
              {value ? (
                <TouchableOpacity
                  style={openSearch ? { display: 'none' } : styles.searchValue}
                  onPress={onPressSearch}>
                  <Text style={styles.text}>{value}</Text>
                  <Icon
                    style={styles.searchIcon}
                    color="white"
                    onPress={handleClearClick}
                    name="close"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={openSearch ? { display: 'none' } : styles.search}
                  onPress={onPressSearch}>
                  <Text style={styles.closedSearchText}>Search</Text>
                  <Image source={SearchIcon} style={styles.searchIcon} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/*  */}
          <View style={styles.headerSecondRow}>
            <DateText style={[styles.dateText, { flex: 0.2 }]} />
            <View style={styles.allergensIcons}>
              {data.allergens.length > 0 || data.excludeGFCereals ? (
                <View style={styles.column}>
                  <Text style={styles.allergensText}>
                    {/* {data.possibleAllergens.length === 0
                      ? 'Your excluded allergens are shown below:'
                      : 'Exclude Recipes that contain'} */}
                    Exclude recipes that Contain
                  </Text>
                  <View
                    style={[
                      styles.iconsContainer,
                      data.allergens.length + (data.excludeGFCereals ? 1 : 0) < 2 
                        ? styles.centered 
                        : {}
                    ]}>
                    {data.allergens
                      .slice(0, data.allergens.length > 4 ? 3 : 4)
                      .map((allergen, index) => (
                        <AllergenIcon
                          key={index}
                          allergen={allergen.allergen}
                          subtypeCount={allergen.subtypeCount}
                          whiteText
                          width={ALLERGEN_ICON_WIDTH}
                        />
                      ))}


                    {data.excludeGFCereals && (
                      <AllergenIcon
                        allergen="gluten"
                        isGlutenFree
                        whiteText
                        width={ALLERGEN_ICON_WIDTH}
                      />
                    )}

                    {data.allergens.length > 4 && (
                      <TouchableOpacity
                        style={styles.marginBottom}
                        onPress={() => setModalVisible(true)}>
                        <Text style={styles.textMore}>More Selected</Text>
                        <Text style={styles.whitePoints}>. . .</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ) : (
                <View style={styles.column} />
              )}
              {(data.allergens.length > 0 || data.excludeGFCereals) &&
                data.possibleAllergens.length > 0 ? (
                  <View style={styles.allergenSeparator} />
                ) : null}
              {data.possibleAllergens.length > 0 ? (
                <View style={styles.column}>
                  <Text style={styles.allergensText}>
                    Exclude recipes which May Contain
                  </Text>
                  <View
                    style={[
                      styles.iconsContainer,
                      data.possibleAllergens.length < 2 ? styles.centered : {}
                      // data.allergens.length > 0
                      //   ? styles.rightIconsContainer
                      //   : {}
                    ]}>
                    {data.possibleAllergens
                      .slice(0, data.possibleAllergens.length > 4 ? 3 : 4)
                      .map((possibleAll, index) => (
                        <AllergenIcon
                          key={index}
                          allergen={possibleAll.allergen}
                          subtypeCount={possibleAll.subtypeCount}
                          whiteText
                          width={ALLERGEN_ICON_WIDTH}
                        />
                      ))}
                    {data.possibleAllergens.length > 4 && (
                      <TouchableOpacity
                        style={styles.marginBottom}
                        onPress={() => setModalVisible(true)}>
                        <Text style={styles.textMore}>More Selected</Text>
                        <Text style={styles.whitePoints}>. . .</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ) : (
                <View style={styles.column} />
              )}
            </View>
            {/* <View style={[styles.outletSelectorContainer]}>
              <OutletSelector />
            </View> */}
            {/* {Constants.manifest.extra &&
            Constants.manifest.extra.environment !== 'PROD' ? (
              <Text style={styles.dummyEl}>
                {Constants.manifest.extra.environment} build
              </Text>
            ) : ( */}
            <View style={styles.dummyEl} />
            {/* )} */}
          </View>
        </View>
      )}
    </RecipesContext.Consumer>
  );
}
