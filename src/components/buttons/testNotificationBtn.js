import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import theme from '../../styles/theme.style';

export default function TestNotificationButton({
  display,
  sendTestNotification,
  title
}) {
  return (
    <View style={styles.buttonContainer}>
      {display ? (
        <Button
          raised
          title={title || 'Test push notification'}
          type="solid"
          titleStyle={{
            color: theme.white,
            marginTop: 1,
            textAlign: 'center'
          }}
          buttonStyle={styles.buttonStyle}
          onPress={sendTestNotification}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 150,
    position: 'absolute',
    bottom: 10,
    zIndex: 10,
    left: 10,
    backgroundColor: '#FFF'
  },
  buttonStyle: {
    backgroundColor: theme.red
  }
});
