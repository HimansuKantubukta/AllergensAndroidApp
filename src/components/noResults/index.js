/* eslint-disable global-require */
import React from 'react';
import { Image } from 'react-native-elements';
import { Text, View } from 'react-native';
import styles from './styles';
import BackButton from '../buttons/BackBtn';

const NoResultsIcon = require('../../../assets/icons/results_not_shown.png');

export default function NoResults({ navigation, backButton }) {
  return (
    <View>
      {backButton ? <BackButton onPress={() => navigation.goBack()} /> : null}
      <View style={styles.recipesNoResults}>
        <Image style={styles.noResultsImage} source={NoResultsIcon} />
        <Text style={styles.noResultsText}>
          {/* No items match your selections. Please change your selections. */}
          No menu plans are currently available.
        </Text>
      </View>
    </View>
  );
}
