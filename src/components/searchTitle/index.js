import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import theme from '../../styles/theme.style';

export default function SearchTitle({ searchQueryFilter }) {
  return (
    <View style={{ backgroundColor: '#F2F6F8' }}>
      <Text style={styles.text}>
        All recipe names containing
        <Text style={styles.boldText}> {searchQueryFilter}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    backgroundColor: theme.background,
    fontSize: 24,
    fontFamily: 'nunito-medium',
    textAlign: 'center'
  },
  boldText: {
    fontSize: 34,
    fontFamily: 'nunito-bold',
    color: '#2A2A2A'
  }
});
