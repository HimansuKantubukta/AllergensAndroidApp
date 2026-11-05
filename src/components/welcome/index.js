/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
import React from 'react';
import { Image } from 'react-native-elements';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from './styles';

const WelcomeIcon = require('../../../assets/icons/allergon_badge.png');

export default function Welcome({ navigation }) {
  return (
    <View style={styles.welcome}>
      <TouchableOpacity onPress={() => navigation.navigate('AdminWrapper')}>
        <Image style={styles.welcomeImage} source={WelcomeIcon} />
      </TouchableOpacity>
      <Text style={styles.welcomeText}>
        Please configure the outlets to display on this device.
      </Text>
    </View>
  );
}
