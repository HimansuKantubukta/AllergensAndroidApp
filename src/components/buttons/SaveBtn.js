import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import theme from '../../styles/theme.style';

export default function SaveButton({ onPress }) {
  return (
    <View style={styles.saveButtonContainer}>
      <Button
        title="Save"
        type="clear"
        titleStyle={styles.titleStyle}
        onPress={onPress}
        buttonStyle={styles.buttonStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  saveButtonContainer: {
    width: 250
  },
  buttonStyle: {
    backgroundColor: theme.green,
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 50
  },
  titleStyle: {
    color: 'white',
    marginTop: 1,

    fontFamily: 'nunito-bold',
    fontSize: 20
  }
});
