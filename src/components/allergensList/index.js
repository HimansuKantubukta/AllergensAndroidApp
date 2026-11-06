import React from 'react';
import { Text, View } from 'react-native';
import AllergenIcon from '../icons/AllergenIcon';
import styles from './styles';

export default function AllergensListWithTitle({
  title,
  border,
  allergens, // array of {allergen, selected, subtypes(optional)}
  onSelect,
  onTooltipOpenClose,
  openTooltips // object e.g. {"nut": false, "gluten": false}
}) {
  function buildAllergenIcon(a) {
    return (
      <AllergenIcon
        key={a.allergen}
        allergen={a.allergen}
        subtypes={a.subtypes}
        selectable={a.selectable}
        selected={a.selected}
        setSelected={a.setSelected}
        onSelect={onSelect}
        onTooltipOpenClose={onTooltipOpenClose}
        tooltipOpen={openTooltips[a.allergen]}
      />
    );
  }

  return (
    <View
      style={[styles.allergensList, border ? styles.allergesListBorder : {}]}>
      {title ? (
        <View style={styles.allergensListTitleContainer}>
          <Text style={styles.allergensListTitle}>{title}:</Text>
        </View>
      ) : (
          <View />
        )}
      <View style={styles.allergensListIconsContainer}>
        {allergens.map(a => {
          return buildAllergenIcon(a);
        })}
      </View>
    </View>
  );
}
