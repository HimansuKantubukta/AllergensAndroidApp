/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable class-methods-use-this */
import React, { useContext } from 'react';
import { View } from 'react-native';
import RecipesContainer from '../../components/recipesContainer';
import RecipesContext from '../../context/RecipesContext';
import MenuContext from '../../context/MenuContext';
import AdminContext from '../../context/AdminContext';
import SearchTitle from '../../components/searchTitle';
import NoResults from '../../components/noResults';
import {
  uniqueRecipesById,
  shouldDisplayRecipePricesForOutlet
} from '../../utils/display';
import style from './styles';
import theme from '../../styles/theme.style';

export default function DayPart({ route, navigation }) {
  const { id, label, fullScreen } = route.params;
  const { data } = useContext(MenuContext);
  const { selectedOutlets } = useContext(AdminContext);
  const dayParts = data.day_parts;
  const dayPart = dayParts.find(p => p.id === id);
  const description = dayPart.description || '';

  // grab the daypart IDs that have the name given in params
  const dayPartIds = dayParts
    .filter(d => d.description === label)
    .map(d => d.id);

  // build a fn that filters out the recipes to just the ones belonging to those dayparts.
  const restrictedToDayParts = visibleRecipes =>
    uniqueRecipesById(visibleRecipes).filter(recipe =>
      dayPartIds.includes(recipe.day_part)
    );

  // Function to check if the current outlet is exempt
  const isExemptOutlet = () => {
    const selectedOutlet = selectedOutlets.find(outlet => outlet.id === data.outlet);
    return selectedOutlet && selectedOutlet.exempt === 'X';
  };

  return (
    <RecipesContext.Consumer>
      {({ visibleRecipes, searchQueryFilter }) => {
        const displayRecipes = restrictedToDayParts(visibleRecipes);

        return (
          <View style={[style.dayPart, fullScreen ? style.fullScreen : null]}>
            {searchQueryFilter.length > 0 && (
              <SearchTitle searchQueryFilter={searchQueryFilter} />
            )}

            {displayRecipes && displayRecipes.length > 0 ? (
              <RecipesContainer
                navigation={navigation}
                backButton
                recipesData={displayRecipes}
                dayPart={description}
                fullScreen={fullScreen}
                style={fullScreen ? { backgroundColor: theme.background } : {}}
                showPrices={shouldDisplayRecipePricesForOutlet(
                  data.outlet,
                  selectedOutlets
                )}
                // Pass exempt status to suppress calorie data only if the outlet is exempt
                exempt={isExemptOutlet()}
              />
            ) : (
              <NoResults backButton navigation={navigation} />
            )}
          </View>
        );
      }}
    </RecipesContext.Consumer>
  );
}
