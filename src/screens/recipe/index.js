/* eslint-disable no-nested-ternary */
import { Image } from 'react-native-elements';
import React, { useContext, useState } from 'react';
import { Text, View, ImageBackground, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import BackButton from '../../components/buttons/BackBtn';
import AllergenIcon from '../../components/icons/AllergenIcon';
import RecipesContext from '../../context/RecipesContext';
import { formatAmount } from '../../utils/currencies';
import { hasItems } from '../../utils/array-utils';
import { MainBubble, Bubble } from '../../components/bubble';
import styles from './styles';

const backgroundImage = require('../../../assets/recipeBg.png');
const wasteFriendlyImage = require('../../../assets/wasteFriendly.png');

/**
 * Returns a filtered array that does not contain
 * "tree nuts" or "Gluten" which are allergen
 * categories and not real allergens - COMAPP-609.
 * @param {Array} allergens Array of strings
 */
function withoutParentAllergens(allergens) {
  return (allergens || []).filter(i => i !== 'gluten' && i !== 'nut');
}

const ingredientDecoration = ingredients => {
  if (!ingredients) {
    ingredients = '';
  }
  return ingredients;
};

function AllergensListWithTitle({ title, border, allergens }) {
  return (
    <View
      style={[styles.allergensList, border ? styles.allergesListBorder : {}]}>
      <View style={styles.allergensListTitleContainer}>
        <Text style={styles.allergensListTitle}>{title}:</Text>
      </View>
      <View style={styles.allergensListIconsContainer}>
        {allergens.map(item => (
          <View key={item} style={styles.allergenIconWrapper}>
            <AllergenIcon key={item} allergen={item} />
          </View>
        ))}
      </View>
    </View>
  );
}

function Ingredients({ title, ingredientString }) {
  return (
    <View style={styles.ingredientsContainer}>
      <View style={styles.ingredientsStringContainer}>
        <Markdown
          style={{
            body: { fontFamily: 'nunito-regular', fontSize: 15 }
          }}>
          {ingredientDecoration(ingredientString)}
        </Markdown>
      </View>
    </View>
  );
}

export default function RecipeDetails({ navigation, route }) {
  const { id, showPrice, isExemptOutlet } = route.params;

  const recipesContext = useContext(RecipesContext);
  const { visibleRecipes } = recipesContext;
  const recipe = visibleRecipes.find(r => r.id === id);
  // It may happen recipe is null if the recipe is not in the visible recipes
  // because it was hidden by allergens or other means
  // in this case, we navigate away to the home page
  // see: https://tracking.keytree.cloud/browse/COMAPP-388
  if (!recipe) {
    navigation.navigate('Home');
    return null;
  }

  const isExemptRecipe = recipe.servingType.includes('None');
  const servingTypeText =
    !isExemptRecipe &&
    (recipe.servingType.includes('Each')
      ? 'per each'
      : recipe.servingType.includes('Aver')
      ? 'per average serving'
      : recipe.servingType.includes('Platter')
      ? `per platter serves ${recipe.targetQty}`
      : `per average serving ${recipe.netWeight}${recipe.weightUnit}`).replace(/\s+/g, ' ');
      
  const isSharedPlatter = recipe.servingType.includes('Platter');

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.content}>
        <View style={styles.innerContent}>
          <View style={styles.titleContainer}>
            {/*  */}
            <View style={[styles.box, styles.backContainer]}>
              <View style={{ marginRight: 'auto' }}>
                <BackButton onPress={() => navigation.goBack()} />
              </View>
            </View>
            {/*  */}
            <View style={styles.recipeNameContainer}>
             {/* WasteFriendly Recipe Logic --> Don't delete this  code as we might use this functionality later */}
              {/* <View style={styles.wasteFriendlyImagePositioning}>
                {recipe.wasteFriendly === 'WF' ? (
                  <Image
                    style={styles.wasteFriendlyStyle}
                    source={wasteFriendlyImage}></Image>
                ) : null}
              </View> */}
              <Text style={styles.title}>{recipe.longName}</Text>
            </View>
            {/*  */}
            <View style={[styles.box, styles.priceContainer]}>
              <Text style={styles.price}>
                {showPrice ? formatAmount(recipe.amount, recipe.currency) : ''}
              </Text>
            </View>
          </View>

          <View style={styles.subTitleContainer}>
            <Text style={styles.subTitle}>{recipe.description || ' '}</Text>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Section to display Ingredients used in the recipe*/}
            <Ingredients
              title="Ingredients"
              ingredientString={recipe.ingredients}
            />
            {isExemptOutlet ? null : (
              <>
                {isExemptRecipe ? null : (
                  <>
                    <View style={styles.subTitleContainer}>
                      <Text style={styles.servingType}>{servingTypeText}</Text>
                    </View>
                    <View style={styles.bubblesContainer}>
                      <MainBubble
                        nutritionalInfo={recipe.nutritionalInfo}
                        servingType={recipe.servingType}
                      />
                      {/* FIXME: Apply DRY PRINCIPLE  */}
                      <Bubble
                        title="Fat"
                        value={recipe.nutritionalInfo.fat}
                        percentage={recipe.nutritionalInfo.fatPercentage}
                        servingType={recipe.servingType}
                      />
                      <Bubble
                        title="Saturates"
                        value={recipe.nutritionalInfo.saturates}
                        percentage={recipe.nutritionalInfo.saturatesPercentage}
                        servingType={recipe.servingType}
                      />
                      <Bubble
                        title="Sugars"
                        value={recipe.nutritionalInfo.sugars}
                        percentage={recipe.nutritionalInfo.sugarsPercentage}
                        servingType={recipe.servingType}
                      />
                      <Bubble
                        title="Salt"
                        value={recipe.nutritionalInfo.salt}
                        percentage={recipe.nutritionalInfo.saltPercentage}
                        servingType={recipe.servingType}
                      />
                    </View>
                    {isSharedPlatter ? null : (
                      <View style={styles.subTitleContainer}>
                        <Text style={styles.intakeReferences}>
                          of an adults reference intake (8400kJ / 2000kcal)
                        </Text>
                      </View>
                    )}
                    <View style={styles.subTitleContainer}>
                      <Text style={styles.intakeReferences}>
                        {`Typical Values per 100g: Energy ${recipe.kJ100G}kJ / ${recipe.kCal100G}kcal`}
                      </Text>
                    </View>
                  </>
                )}
              </>
            )}
            <View style={styles.allergensBoxContainer}>
              {hasItems(recipe.contains) || hasItems(recipe.may_contain) ? (
                <View style={styles.allergensBox}>
                  <Text style={styles.allergensTitle}>Allergens</Text>
                  {hasItems(recipe.contains) ? (
                    <AllergensListWithTitle
                      title="Contains"
                      border
                      allergens={withoutParentAllergens(recipe.contains)}
                    />
                  ) : null}
                  {hasItems(recipe.may_contain) ? (
                    <AllergensListWithTitle
                      title="May contain"
                      allergens={withoutParentAllergens(recipe.may_contain)}
                    />
                  ) : null}
                </View>
              ) : (
                <View style={styles.allergensBox}>
                  <Text style={styles.allergensTitle}>Allergens</Text>
                  <Text style={styles.noAllergensBanner}>
                    There are no allergens.
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.NutritionAdvice}>
              <Text>
                  <Text style={styles.NutritionAdviceBoldText}>Allergen and Nutrition Advice:</Text>{'\n'}
                  <Text style={styles.NutritionAdviceText}>Ingredients highlighted in bold or annotated in Contains are allergens that are present in this product.</Text>{'\n'}
                  <Text style={styles.NutritionAdviceText}>May Contain = Cross Contamination risk indicating that this ingredient is present in the manufacturing site / factory or supply chain and our suppliers believe there is a significant risk that this allergen could contaminate the food.</Text>{'\n'}
                  <Text style={styles.NutritionAdviceBoldText}>Our busy kitchens endeavour to take all reasonable steps to avoid any risk of cross contamination however we cannot guarantee that our food is 100% free from a specific allergen</Text>            
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}
