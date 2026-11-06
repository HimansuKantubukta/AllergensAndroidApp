/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
import { flatten, clone } from 'ramda';
import { indexArrayToObj, containsNone } from './array-utils';

/**
 * Returns array of recipes, making sure recipes are not repeated.
 * Comparing combination of day_part,amount,curr,name
 * @param {Array} recipes
 */
export function uniqueRecipes(recipes) {
  const index = {};
  recipes.forEach(r => {
    index[`${r.day_part}-${r.amount}-${r.currency}-${r.longName}`] = r;
  });
  return Object.values(index);
}

/**
 * Returns array of recipes, making sure recipes are not repeated.
 * Comparing recipeId
 * @param {Array} recipes
 */
export function uniqueRecipesById(recipes) {
  const index = {};
  recipes.forEach(r => {
    if (!index[`${r.recipeId}`]) {
      index[`${r.recipeId}`] = r;
    }
  });
  return Object.values(index);
}

/**
 * Reads selections from the RecipesContext, filters the recipes
 * and saves the results into visibleRecipes.
 * All the parameters that are not provided are read from
 * the context.
 * @param {Array} allergens Array of strings or array of objects with allergen
 * @param {Array} possibleAllergens Same as allergens
 * @param {Array} selectedMenuPlanIds Array of strings
 * @param {Array} allRecipes Array of recipes
 * @param {RecipesContext} context context object
 * @returns {Array} visible recipes set in the context
 */
export function filterRecipesFromSelections(
  {
    allergens = context.allergens,
    possibleAllergens = context.possibleAllergens,
    selectedMenuPlanIds = context.selectedMenuPlanIds,
    searchQueryFilter = (context && context.searchQueryFilter) || '',
    allRecipes = context.allRecipes,
    excludeGFCereals = context.excludeGFCereals
  },
  context
) {
  const { setVisibleRecipes, vsibleDayParts } = context;

  // Filter the visible recipes by all criteria

  // First normalize allergens and possibleAllergens.
  // They may come as an array of strings or an array of objects with shape e.g. {allergen: "nut"}
  const normalizedAllergens = normalizeAllergen(allergens);
  const normalizedPossibleAllergens = normalizeAllergen(possibleAllergens);

  console.log(
    `filterRecipesFromSelections: allergens: ${JSON.stringify(allergens)}`
  );

  console.log(
    `filterRecipesFromSelections: normalizedAllergens: ${JSON.stringify(
      normalizedAllergens
    )}`
  );

  const dayParts = vsibleDayParts;
  const filtered = filterRecipes(
    allRecipes,
    selectedMenuPlanIds,
    dayParts,
    normalizedAllergens,
    normalizedPossibleAllergens,
    searchQueryFilter,
    excludeGFCereals
  );

  setVisibleRecipes(filtered);
  return filtered;
}

export function filterDayPartsFromMenuPlans(
  {
    selectedMenuPlanIds = context.selectedMenuPlanIds,
    dayParts,
    visibleRecipes = context.visibleRecipes
  },
  context
) {
  const { setVisibleDayParts } = context;
  let result = filterByValues(dayParts, 'menu_plan', selectedMenuPlanIds);
  // Filter out day parts that don't have recipes visible.
  result = result.filter(d => visibleRecipes.find(r => r.day_part === d.id));
  setVisibleDayParts(result);
  return result;
}

export function normalizeAllergen(arr) {
  const allergenCodes = arr.map(a => {
    if (typeof a === 'object') {
      if (Array.isArray(a.subtypes) && a.subtypes.length > 0) {
        return a.subtypes.map(sub => sub.allergen); // array of strings
      }
      return a.allergen; // string
    }
    // not an object, just return it.
    return a;
  });
  return flatten(allergenCodes); // we need to flatten to put sub-allergens at the same level as main allergens
}

/**
 * Given a list of recipes and some optional filtering criteria, filters the recipes
 * down by those criteria.
 * Returns a set of recipes to display to the user based on the filter criteria specified.
 * @param {Array} recipes Array of recipes to filter down
 * @param {Array} menuPlansFilter Array of menu parts to filter by. If empty include all menuPlans
 * @param {Array} dayPartsFilter Array of day parts to filter by. If empty include all dayParts
 * @param {Array} allergensFilter Array of strings
 * @param {Array} possibleAllergensFilter Array of strings
 * @param {String} searchQueryFilter
 * @returns {Array} Array of recipes
 */
export function filterRecipes(
  recipes,
  menuPlansFilter = [],
  dayPartsFilter = [],
  allergensFilter = [],
  possibleAllergensFilter = [],
  searchQueryFilter = '',
  excludeGFCereals = false
) {
  let result = recipes;

  // 1. Menu plan filtering
  result = filterByValues(
    result,
    'menu_plan',
    menuPlansFilter
  );

  // 2. Day part filtering
  result = filterByValues(
    result,
    'day_part',
    dayPartsFilter
  );

  // 3. NORMAL "CONTAINS" filtering
  // Only recipe.contains is checked here.
  result = filterArrayByNotIn(
    result,
    'contains',
    allergensFilter
  );

  // 4. NORMAL "MAY CONTAIN" filtering
  // Only recipe.may_contain is checked here.
  result = filterArrayByNotIn(
    result,
    'may_contain',
    possibleAllergensFilter
  );

  // 5. GF filtering is completely independent.
  // GF is a Contains-only concept.
  if (excludeGFCereals) {
    result = result.filter(recipe => {
      const contains = recipe.contains || [];

      return !contains.some(
        allergen =>
          typeof allergen === 'string' &&
          allergen.startsWith('GF ')
      );
    });
  }

  // 6. Search
  result = filterRecipesBySearchQuery(
    searchQueryFilter,
    result
  );

  return result;
}

/**
 * Recipes is an array of objects. Filters every object based on the property
 * propName containing a value in the valuesFilter (or not).
 * When the value of the property is in valuesFilter, that object is included.
 * @param {Array} recipes Array of objects
 * @param {String} propName Name of property in the objects
 * @param {Array} valuesFilter Array of strings
 */
function filterByValues(recipes, propName, valuesFilter) {
  let result = recipes;
  if (valuesFilter && Array.isArray(valuesFilter) && valuesFilter.length > 0) {
    const valuesIdx = indexArrayToObj(valuesFilter);
    const valueInFilter = mp => !!valuesIdx[mp];
    result = recipes.filter(r => valueInFilter(r[propName]));
  }
  return result;
}

/**
 * Recipes is an array of objects. Filters every object based on the property
 * propName not containing a value in the valuesFilter.
 * For each object if the .[propName] (which is assumed to be an array)
 * contains any of the values in valuesFilter, that object is _NOT_ included.
 * @param {Array} recipes Array of objects
 * @param {String} propName Name of property in the objects
 * @param {Array} valuesFilter Array of strings
 */
export function filterArrayByNotIn(
  recipes,
  propName,
  valuesFilter
) {
  if (!Array.isArray(valuesFilter) || valuesFilter.length === 0) {
    return recipes;
  }

  return recipes.filter(recipe => {
    const allergens = Array.isArray(recipe[propName])
      ? recipe[propName]
      : [];

    return containsNone(allergens, valuesFilter);
  });
}


/**
 * Recipes is an array of objects. Filters every object based on the property
 * name containing a searchQuery.
 * @param {Array} recipes Array of objects
 * @param {String} searchQuery value of a searchQuery
 */
function filterRecipesBySearchQuery(searchQuery, recipes) {
  if (!searchQuery || typeof searchQuery !== 'string') {
    return recipes || [];
  }
  const searchText = searchQuery.toLowerCase().trim();
  if (!searchText) {
    return recipes || [];
  }
  const wordsFromSearch = searchText.split(' ').filter(Boolean);
  let filteredData = [];
  for (let i = 0; i < wordsFromSearch.length; i++) {
    filteredData =
      i === 0
        ? (recipes || []).filter(item => {
          return (item.longName || '')
            .toLowerCase()
            .includes(wordsFromSearch[i]);
          // ||
          // (item.ingredients || '')
          //   .toLowerCase()
          //   .includes(wordsFromSearch[i])
        })
        : filteredData.filter(item => {
          return (item.longName || '')
            .toLowerCase()
            .includes(wordsFromSearch[i]);
          // ||
          // (item.ingredients || '')
          //   .toLowerCase()
          //   .includes(wordsFromSearch[i])
        });
  }
  return filteredData;
}

// Use it on a .filter(onlySelected)
const onlySelected = s => s.selected;

/**
 * Returns a new array with the allergens that have selected:true.
 *
 * Note: Until defect COMAPP-614 all this did was
 * .filter(onlySelected) of the given array.
 * This works for all types of allergens but does not work correctly
 * for allergens with subtypes (tree nuts and Gluten)
 * as it keeps all the subtypes in there regardless of the subtype
 * being selected or not.
 *
 * Items in allergenStates have a property called "subtypes" which is an array.
 * That array can be empty or it can contain allergens (same structure of the allergensStates)
 * array.
 *
 * @param {Array} allergensStates Array of objects with properties like `selected:bool`,`allergen:string`, ...
 * @returns brand new deep copy of the items that have selected:true
 */
export function onlySelectedAllergensAndSelectedSuballergens(allergensStates) {
  const set1 = (allergensStates || []).map(allergen => {
    // return a brand new object.
    const allergenClone = clone(allergen);
    allergenClone.subtypes = (allergenClone.subtypes || []).filter(
      onlySelected
    );
    return allergenClone;
  });
  // set1 contains unselected allergens but only selected subtypes.
  // we now filter the unselected allergens out.
  return set1.filter(onlySelected);

  // return [...allergensStates.filter(onlySelected)]; <- this is wrong. Don't do this. COMAPP-614
}

/**
 * shouldDisplayRecipePricesForOutlet:
 *
 * Given the ID of the currently selected outletm and the list of outlets,
 * returns true if we should display recipe prices for this specific outlet.
 *
 * In case outlets have no `hidePrices` we return the default option.
 * By default we show prices (return true)
 *
 * @param {String} currentOutletId Currently selected outlet id
 * @param {Array} selectedOutletsArr Array of { id, name, hidePrices(str|bool) } - list of outlets.
 */
export function shouldDisplayRecipePricesForOutlet(
  currentOutletId,
  selectedOutletsArr = []
) {
  const outlet = selectedOutletsArr.find(o => o.id === currentOutletId);
  if (outlet && outlet.hidePrices === 'X') {
    return false;
  }
  // NOTE: There a field called showPrices in the outlet but this has been
  // deprecated in favor of a field called hidePrices with the opposite meaning.
  return true; // by default we show prices
}
