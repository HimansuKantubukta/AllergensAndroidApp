import { Image } from 'react-native-elements';
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import theme from '../../styles/theme.style';
import { formatAmount } from '../../utils/currencies';
import { View } from 'native-base';

const wasteFriendlyImage = require('../../../assets/wasteFriendly.png');

export default function RecipeButton({
  text,
  style,
  onPress,
  amount,
  currency,
  showPrice = true,
  wasteFriendly,
  calories,
  kilojoules,
  targetQty,
  exempt,
  netWeight,
  weightUnit,
  kCal100G,
  kJ100G,
  servingType
}) {
  function handleExemptRecipes(exempt){
    const isExemptRecipe = servingType.includes('None');
    if(isExemptRecipe){
      return true;
    }
    return false;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        return onPress ? onPress() : null;
      }}
      activeOpacity={0.7}
      style={[styles.button, { ...style }]}>
      <Text numberOfLines={3} ellipsizeMode="tail" style={styles.buttonText}>
        {text}
      </Text>
      {showPrice ? (
        <Text style={styles.price}>{formatAmount(amount, currency)}</Text>
      ) : null}
      {!exempt && !handleExemptRecipes(servingType) && calories && kilojoules ? (
        <>
          <View style={styles.calories}>
          <Text >{kilojoules} kJ</Text>
          {calories && kilojoules ? <Text> / </Text> : null}
          <Text >{calories} kcal</Text>
          </View>
        </>
      ) : null}
      {!handleExemptRecipes(servingType) && targetQty ? (
        <Text style={styles.targetQty}>Serves {targetQty}</Text>
      ) : null}
      { /* WasteFriendly Recipe Logic --> Don't delete this  code as we might use this functionality later */ }
      {/* <View style={styles.imagePositioning}>
        {wasteFriendly === 'WF' ? (
          <Image
            style={styles.wasteFriendlyStyle}
            source={wasteFriendlyImage}></Image>
        ) : null}
      </View> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 119,
    justifyContent: 'center',
    margin: 5,
    padding: 5,
    // shadowColor: '#000',
    // shadowOffset: {
    //  width: 0,
    //  height: 1
    // },
    //shadowOpacity: 0.22,
    //shadowRadius: 2.22,
    // elevation: 3,
    borderColor: theme.lightgray,
    borderWidth: 3
  },
  buttonText: {
    color: '#444444',
    fontSize: 22,
    fontFamily: 'nunito-bold',
    textAlign: 'center',
    paddingHorizontal: 10,
    padding: 30
  },
  price: {
    backgroundColor: theme.lightgray,
    color: theme.darkgray,
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 3,
    paddingHorizontal: 10,
    fontFamily: 'nunito-regular',
    fontSize: 15,
    borderBottomLeftRadius: 4
  },
  /* WasteFriendly Recipe Logic --> Don't delete this  code as we might use this functionality later */
  // wasteFriendlyStyle: {
  //   width: 45,
  //   height: 45
  // },
  calories: {
    backgroundColor: theme.lightgray,
    color: theme.darkgray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
    // alignContent: 'center',
    // alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    // left: 0,
    // padding: 3,
    // paddingHorizontal: 10,
    // fontFamily: 'nunito-regular',
    // fontSize: 15,
    // borderTopRightRadius: 4
  },
  targetQty: {
    // backgroundColor: theme.lightgray,
    color: theme.darkgray,
    position: 'absolute',
    bottom: 20,
    padding: 3,
    paddingHorizontal: 10,
    fontFamily: 'nunito-regular',
    fontSize: 15
  },
  kilojoules: {
    backgroundColor: theme.lightgray,
    color: theme.darkgray,
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 3,
    paddingHorizontal: 10,
    fontFamily: 'nunito-regular',
    fontSize: 15,
    borderTopLeftRadius: 4
  },
  imagePositioning: {
    position: 'absolute',
    top: 3,
    left: 0,
    paddingHorizontal: 8,
    paddingBottom: 8
  }
});
