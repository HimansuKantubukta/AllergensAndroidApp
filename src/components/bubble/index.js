import React from 'react';
import { ImageBackground, View, Text } from 'react-native';
import styles from './styles';
const bubble = require('../../../assets/bubble.png');
const bubbleNoPercentage = require('../../../assets/bubbleNoPercentage.png');

export function MainBubble({ nutritionalInfo, servingType }) {
  const isSharedPlatter = servingType.includes('Platter');

  return (
    <ImageBackground
      source={isSharedPlatter ? bubbleNoPercentage : bubble}
      style={styles.backgroundImage}>
      <View style={styles.bubbleContent}>
        <Text
          style={
            isSharedPlatter
              ? styles.bubbleTitleNoPercentage
              : styles.bubbleTitle
          }>
          Energy
        </Text>
        <Text style={isSharedPlatter ? styles.calKjNoPercentage : styles.calKj}>
          {nutritionalInfo.kilojoules}kJ
        </Text>
        <Text style={isSharedPlatter ? styles.calKjNoPercentage : styles.calKj}>
          {nutritionalInfo.calories}kcal
        </Text>
      </View>
      {isSharedPlatter ? null : (
        <View style={styles.lowMainBubbleContent}>
          <Text style={styles.percentage}>
            {nutritionalInfo.kilojoulesPercentage}%
          </Text>
        </View>
      )}
    </ImageBackground>
  );
}

export function Bubble({ title, value, percentage, servingType }) {
  const isSharedPlatter = servingType.includes('Platter');
  return (
    <ImageBackground
      source={isSharedPlatter ? bubbleNoPercentage : bubble}
      style={styles.backgroundImage}>
      <View style={styles.bubbleContent}>
        <Text
          style={
            isSharedPlatter
              ? styles.bubbleTitleNoPercentage
              : styles.bubbleTitle
          }>
          {title}
        </Text>
        <Text
          style={
            isSharedPlatter ? styles.bubbleInfoNoPercentage : styles.bubbleInfo
          }>
          {value}g
        </Text>
      </View>
      {isSharedPlatter ? null : (
        <View style={styles.lowBubbleContent}>
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>
      )}
    </ImageBackground>
  );
}
