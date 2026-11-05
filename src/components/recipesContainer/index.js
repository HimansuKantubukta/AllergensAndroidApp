/* eslint-disable class-methods-use-this */
import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import RecipeButton from '../buttons/RecipeBtn';
import BackButton from '../buttons/BackBtn';
import theme from '../../styles/theme.style';
import BackToTopButton from '../buttons/BackToTop';
import { removeRepeatsComparingProp } from '../../utils/array-utils';

export default function RecipesContainer({
  navigation,
  backButton,
  dayPart,
  recipesData,
  fullScreen,
  style = {},
  showPrices = true,
  exempt
}) {
  const [displayBackToTop, setDisplayBackToTop] = useState(false);
  const scrollRef = useRef();

  function onScroll({ nativeEvent }) {
    setDisplayBackToTop(nativeEvent.contentOffset.y > 20);
  }

  function createButtonsGrid(recipesWithPotentialRepeats) {
    // Note: we may have the repeats if the same recipe exists in
    // different menu plans or different day parts
    // Note 2: We always comparing the originalRecipeId.
    const recipes = removeRepeatsComparingProp(
      recipesWithPotentialRepeats,
      'originalRecipeId'
    );
    return (
      <View style={[styles.buttonsContainer, style]}>
        {recipes.map(recipe => (
          <RecipeButton
            key={`${recipe.id}`}
            style={StyleSheet.flatten(styles.button)}
            text={recipe.longName}
            amount={recipe.amount}
            currency={recipe.currency}
            showPrice={showPrices}
            /* WasteFriendly Recipe Logic --> Don't delete this  code as we might use this functionality later */
            // wasteFriendly={recipe.wasteFriendly}
            calories={recipe.nutritionalInfo.calories}
            targetQty={recipe.targetQty}
            kilojoules={recipe.nutritionalInfo.kilojoules}
            exempt={exempt}
            netWeight={recipe.netWeight}
            weightUnit={recipe.weightUnit}
            kCal100G={recipe.kCal100G}
            kJ100G={recipe.kJ100G}
            servingType={recipe.servingType}
            onPress={() =>
              navigation.navigate('RecipeDetails', {
                id: recipe.id,
                showPrice: showPrices,
                isExemptOutlet: exempt
              })
            }
          />
        ))}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.recipesContainer,
        fullScreen ? styles.recipesContainerFullScreen : null,
        style
      ]}>
      <View style={styles.recipesInnerContainer}>
        <View style={styles.titleContainer}>
          {backButton ? (
            <BackButton onPress={() => navigation.goBack()} />
          ) : (
            <View style={styles.backButtonContainer}>
              <Text />
            </View>
          )}
          <Text
            style={[styles.title, fullScreen ? styles.fullScreenTitle : null]}>
            {dayPart}
          </Text>
          {/* Dummy element so title is centered */}
          <View style={styles.backButtonContainer}>
            <Text />
          </View>
        </View>
        <BackToTopButton display={displayBackToTop} scrollViewRef={scrollRef} />
        <ScrollView
          style={styles.scrollView}
          ref={ref => {
            scrollRef.current = ref;
          }}
          scrollEventThrottle={200}
          onScroll={onScroll}>
          {createButtonsGrid(recipesData)}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  recipesContainer: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.recipebg,
    margin: 0,
    marginBottom: 30
  },
  recipesContainerFullScreen: {
    marginBottom: 0
  },
  recipesInnerContainer: {
    width: '100%',
    height: '100%',
    padding: 20,
    paddingTop: 0
  },
  scrollView: {
    height: '100%',
    marginBottom: 10
  },
  backButtonContainer: {
    width: 100
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  title: {
    fontFamily: 'nunito-bold',
    color: theme.darkgray,
    fontSize: 30,
    marginTop: 0,
    paddingTop: 0
  },
  fullScreenTitle: {
    fontSize: 34,
    color: theme.dark
  },
  buttonsContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  button: {
    width: '32.5%',
    minWidth: 380,
    padding: 10,
    minHeight: 185
  }
});
