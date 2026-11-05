/* eslint-disable global-require */
import React, { useState } from 'react';
import { Image, Icon, CheckBox, Button } from 'react-native-elements';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import theme from '../../styles/theme.style';
import { allergenIconImgSrc, allergenText } from '../../../config/allergens';

const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function AllergenIcon({
  allergen, // "nut"
  subtypes = [], // ["rye", "oats"] or empty array
  selected,
  setSelected,
  selectable,
  onSelect, // called with allergen(string) and a boolean for the selection
  tooltipOpen,
  setTooltipOpen,
  whiteText,
  subtypeCount,
  onTooltipOpenClose, // called with allergen(string) and a boolean for open/close
  width,
  excludeGFCereals,
  setExcludeGFCereals,
  sectionType,
  isGlutenFree
}) {
  const children = buildPopover();
  const src = allergenIconImgSrc[allergen];
  const size = 54;

  function handlePress() {
    onSelect(allergen, !selected);
  }

  function handleClose() {
    // TODO: Check here if no subtypes are selected
    if (setTooltipOpen) {
      setTooltipOpen(false);
    }
  }

  function buildPopover() {
    if (allergen === 'nut' || allergen === 'gluten') {
      return buildSubtypesPopover();
    }
    return null;
  }

  function handleSelectAll() {
    const safeSubtypes = subtypes || [];
    const newSelectAll = !(
      /* selectAll  || */ subtypes.reduce(
        (acc, val) => val.selected && acc,
        true
      )
    );
    safeSubtypes.forEach(a => onSelect(a.allergen, newSelectAll));
    // setSelectAll(newSelectAll);
  }

  function buildSubtypesPopover() {
    const [selectAll, setSelectAll] = useState(false);

    function handleSubtypePress(allergenObj) {
      if (onSelect && allergenObj.selectable) {
        onSelect(allergenObj.allergen, !allergenObj.selected);
      }
    }

    return (
      <View style={styles.popoverContainer}>
        <View style={styles.popoverContainerTitleContainer}>
          <Text style={styles.popoverContainerTitleText}>&nbsp;</Text>
          <Button
            title="✕"
            buttonStyle={styles.closeButton}
            containerStyle={styles.closeButtonContainer}
            titleStyle={styles.closeButtonTitle}
            type="clear"
            onPress={handleClose}
          />
        </View>

        {subtypes.map(s => {
          return (
            <CheckBox
              key={s.allergen}
              containerStyle={styles.allergenCheckbox}
              title={capitalize(s.allergen)}
              checked={s.selected}
              iconType="material-community"
              checkedIcon="check-box-outline"
              uncheckedIcon="checkbox-blank-outline"
              onPress={() => handleSubtypePress(s)}
              checkedColor={theme.darkgray}
              fontFamily={s.selected ? 'nunito-light' : 'nunito-medium'}
              textStyle={
                s.selected
                  ? styles.subAllergenTextSelected
                  : styles.subAllergenTextNotSelected
              }
            />
          );
        })}

        {allergen === 'gluten' && sectionType === 'contains' && (
          <View style={styles.gfContainer}>
            <CheckBox
              title="Exclude Recipes that contain Cereals with Gluten Free"
              checked={excludeGFCereals}
              onPress={() => setExcludeGFCereals(!excludeGFCereals)}
              iconType="material-community"
              checkedIcon="check-box-outline"
              uncheckedIcon="checkbox-blank-outline"
              containerStyle={styles.gfCheckbox}
            />
          </View>
        )}
      </View>
    );
  }

  return (
    <View>
      <View style={styles.allergenIconContainer}>
        {/* Use the presence of an onSelect handler to render an interactive icon */}
        {onSelect ? (
          <TouchableOpacity onPress={handlePress}>
            <View style={[styles.iconAndCrossContainer]}>
              <Image
                containerStyle={selected ? styles.reducedOpacity : null}
                source={src}
                style={[
                  selected ? styles.selected : styles.notSelected,
                  { width: size, height: size }
                ]}
              />
              <View style={[selected ? styles.cross : null]} />
            </View>
          </TouchableOpacity>
        ) : (
          // When the icon is not interactive:
          <Image
            source={src}
            style={[
              selected ? styles.selected : styles.notSelected,
              { width: width || 54, height: width || 54 }
            ]}
          />
        )}
        <Text
          style={[
            whiteText ? styles.allergenIconTextWhite : styles.allergenIconText,
            selected ? styles.allergenIconTextSelected : null
          ]}>
          {isGlutenFree
            ? 'Gluten Free'
            : `${allergenText[allergen]} ${
                subtypeCount ? `(${subtypeCount})` : ''
              }`}
        </Text>
        {/* 05/01/2021: Moved subtypeCount to be inline to have a shorter header */}
        {/* {subtypeCount && (
          <Text style={styles.allergenIconSecondRow}>
            {`(${subtypeCount})`}
          </Text>
        )} */}
        {children && onSelect ? (
          <Icon
            size={15}
            containerStyle={styles.tooltipIndicatorContainer}
            type="font-awesome"
            name={tooltipOpen ? 'angle-up' : 'angle-down'}
          />
        ) : null}
      </View>
      {tooltipOpen ? <View style={styles.tooltip}>{children}</View> : null}
      {tooltipOpen ? <View style={styles.arrow} /> : null}
    </View>
  );
}

const tooltipWidth = 320;
const arrowWidth = 10;
const iconWidth = 54;
const iconPadding = 40;

const styles = StyleSheet.create({
  allergenIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    width: 80 //95
    //backgroundColor: 'red'
  },

  gfCheckbox: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 0,
    margin: 0,
    padding: 0,
    
  },

  gfContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(151,151,151,0.3)',
    marginTop: 8,
    paddingTop: 8,
  },
  
  allergenIconText: {
    fontFamily: 'nunito-medium',
    fontSize: 12,
    color: theme.darkgray,
    marginTop: 5
    //letterSpacing: 1.17 // FIXME
  },
  allergenIconTextSelected: {
    fontWeight: '600',
    fontFamily: 'nunito-extra-bold'
  },
  allergenIconTextWhite: {
    fontFamily: 'nunito-medium',
    fontSize: 12,
    color: theme.white,
    marginTop: 5
  },
  allergenIconSecondRow: {
    fontFamily: 'nunito-medium',
    fontSize: 14,
    color: theme.white
  },
  popoverContainer: {
    flexDirection: 'row',
    // width: 300,
    // height: 200,
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  popoverContainerSelectAllContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 0,
    margin: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(151,151,151,0.3)'
  },
  popoverContainerTitleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 10,
    marginVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(151,151,151,0.3)',
    marginBottom: 5
  },
  popoverContainerTitleText: {
    fontSize: 18,
    fontFamily: 'nunito-regular'
  },
  allergenCheckbox: {
    width: 130,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0
  },
  popoverContainerSelectAll: {
    width: 150,
    backgroundColor: 'white',
    borderWidth: 0
  },
  tooltip: {
    position: 'absolute',
    top: 80,
    left: iconWidth / 2 - tooltipWidth / 2 + iconPadding / 2, // -120,
    zIndex: 1,
    backgroundColor: 'white',
    borderColor: 'rgba(151,151,151,0.25)',
    borderWidth: 1,
    width: tooltipWidth,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 400
  },
  arrow: {
    position: 'absolute',
    top: 75,
    left: iconWidth / 2 - arrowWidth / 2 + iconPadding / 2 + 3, // 40,
    width: arrowWidth,
    height: arrowWidth,
    backgroundColor: 'white',
    borderColor: 'rgba(151,151,151,0.25)',
    transform: [{ rotateZ: '45deg' }],
    elevation: 4000,
    borderWidth: 0,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 0,
    borderRightWidth: 0
  },
  notSelected: {
    borderColor: 'transparent',
    borderWidth: 3,
    margin: -6,
    borderRadius: 40
  },
  reducedOpacity: {
    opacity: 0.6
  },
  selected: {
    borderColor: theme.darkgray,
    borderWidth: 3,
    margin: -6,
    borderRadius: 40,
    opacity: 1
  },
  iconAndCrossContainer: {
    position: 'relative',
    // backgroundColor: 'red',
    overflow: 'hidden',
    padding: 8
  },
  cross: {
    position: 'absolute',
    backgroundColor: theme.darkgray,
    width: '88%',
    height: 5,
    transform: [{ skewY: '-45deg' }, { translateY: 38 }, { translateX: 10 }],
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.6
  },
  crossMoved: {},
  tooltipIndicatorContainer: {
    backgroundColor: 'transparent',
    top: -4
  },
  closeButtonContainer: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  closeButton: {},

  closeButtonTitle: { color: '#444444' },
  subAllergenTextNotSelected: {
    fontSize: 17,
    letterSpacing: 0.26,
    color: theme.darkgray,
    fontFamily: 'nunito-regular',
    fontWeight: 'normal'
  },
  subAllergenTextSelected: {
    fontSize: 17,
    letterSpacing: 0.26,
    color: theme.darkgray,
    fontWeight: 'bold',
    fontFamily: 'nunito-regular'
  }
});
