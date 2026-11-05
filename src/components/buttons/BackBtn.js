import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import theme from '../../styles/theme.style';

export default function BackButton({ onPress }) {
  return (
    <View style={styles.backButtonContainer}>
      <Button
        icon={{
          name: 'keyboard-arrow-left',
          size: 55,
          color: theme.dark
        }}
        title="BACK"
        type="clear"
        titleStyle={styles.titleStyle}
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backButtonContainer: {
    width: 100
  },
  titleStyle: {
    marginTop: -5,
    marginLeft: -15,
    fontFamily: 'nunito-bold',
    color: theme.dark,
    fontSize: 18,
    lineHeight: 45,
    textAlignVertical: 'center'
    // backgroundColor: 'red',
  }
});
