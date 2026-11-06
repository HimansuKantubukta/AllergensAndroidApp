import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import AdminContext from '../../context/AdminContext';

export default function AdminBottom({
  navigation,
  outlets,
  saveOutlets,
  nextHandler,
  proceedButtonText
}) {
  const adminContext = useContext(AdminContext);
  const navigate = () => {
    saveOutlets([]);
    navigation.navigate('AdminHome');
    adminContext.setSelectedOutlets([]);
  };
  const handleNext = () => {
    nextHandler();
  };
  return (
    <View style={styles.bottomStyle}>
      <Text onPress={navigate} style={styles.underlinedText}>
        Exit without saving
      </Text>
      <Button
        title={proceedButtonText}
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.buttonText}
        onPress={handleNext}
        disabled={!outlets.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomStyle: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 40
  },
  buttonStyle: {
    width: 300,
    backgroundColor: '#5BB4B1',
    height: 50
  },
  buttonText: {
    color: 'white',
    fontFamily: 'nunito-bold',
    fontSize: 20
  },
  underlinedText: {
    textDecorationLine: 'underline',
    fontSize: 20,
    fontFamily: 'nunito-bold',
    color: '#2A2A2A',
    // increase padding so that it is easier to tap
    paddingVertical: 10,
    paddingHorizontal: 30
  }
});
