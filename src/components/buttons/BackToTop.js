import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import theme from '../../styles/theme.style';

export default function BackToTopButton({ display, scrollViewRef }) {
  function scrollToTop() {
    if (scrollViewRef && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  }

  return (
    <View style={styles.buttonContainer}>
      {display ? (
        <Button
          raised
          icon={{
            name: 'keyboard-arrow-up',
            size: 25,
            color: theme.white
          }}
          type="solid"
          titleStyle={{
            color: theme.white,
            marginTop: 1,
            textAlign: 'center'
          }}
          buttonStyle={styles.buttonStyle}
          onPress={scrollToTop}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 50,
    position: 'absolute',
    bottom: 10,
    zIndex: 10,
    right: 10,
    backgroundColor: '#FFF'
  },
  buttonStyle: {
    backgroundColor: theme.red
  }
});
