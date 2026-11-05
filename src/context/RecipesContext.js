import React from 'react';

const noop = () => {};

const RecipesContext = React.createContext({
  allRecipes: [],
  visibleRecipes: [],
  allergens: [], // e.g. [{allergen: "fish", setSelected: fn}, {allergen: "gluten", setSelected: fn, subtypeCount: 2, subtypes:[...]}],
  possibleAllergens: [], // e.g. [{allergen: "fish", setSelected: fn}, {allergen: "gluten", subtypeCount: 2, setSelected: fn}],
  excludeGFCereals: false,
  setExcludeGFCereals: noop,
  selectedMenuPlanIds: [], // Array of strings
  visibleDayParts: [],
  searchQueryFilter: '',
  currentDay: new Date(),
  recipeSaveDay: {},
  outletsWithManualRefresh: false,
  outletSelectionDate: new Date(),
  setRecipeSaveDay: noop,
  setOutletsWithManualRefresh: noop,
  setOutletSelectionDate: noop,
  setSearchQueryFilter: noop,
  setVisibleRecipes: noop,
  setAllergens: noop,
  setPossibleAllergens: noop,
  setSelectedMenuPlanIds: noop,
  setVisibleDayParts: noop,
  resetFilters: noop,
  setOutletData: noop // call to set recipes, menu plans and day parts
});

export default RecipesContext;
