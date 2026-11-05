/* eslint-disable no-nested-ternary */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Overlay, Text, Button, Icon } from 'react-native-elements';
import theme from '../../styles/theme.style';

export default function ConfirmationPopup({
  visible,
  handleClose,
  handleYes,
  error,
  networkConnection
}) {
  return (
    <Overlay
      width={620}
      height={370}
      overlayStyle={[styles.overlay]}
      containerStyle={styles.overlayContainer}
      animationType="fade"
      transparent
      onRequestClose={() => {}}
      isVisible={visible}
      windowBackgroundColor="rgba(0,0,0,0.7)"
      overlayBackgroundColor="white">
      <View style={styles.confirmationPopup}>
        <Button
          title="✕"
          buttonStyle={styles.closeButton}
          containerStyle={styles.closeButtonContainer}
          titleStyle={styles.closeButtonTitle}
          type="clear"
          onPress={handleClose}
        />
        <View style={styles.updateIconContainer}>
          <Icon
            type="material-community"
            size={36}
            color={theme.gray1}
            name={
              !networkConnection ? 'wifi-off' : error ? 'alert-outline' : 'sync'
            }
          />
        </View>
        {!networkConnection ? (
          <>
            <Text style={styles.confirmationTitle}>Poor Connection</Text>
            <Text style={styles.confirmationMessage}>
              The device is struggling to find a secure{'\n'}
              connection. Please seek stronger connectivity{'\n'}
              and try again.
            </Text>
          </>
        ) : error ? (
          <>
            <Text style={styles.confirmationTitle}>Request Failed</Text>
            <Text style={styles.confirmationMessage}>
              {error && error.message
                ? error.message
                : `Data update failed, please retry update.\nNote: This tablet cannot display data until a successful update has been completed`}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.confirmationTitle}>
              Data update confirmation
            </Text>
            <Text style={styles.confirmationMessage}>
              Do you wish to update the data on this device and confirm new Menu
              Plans and Outlets?
            </Text>
          </>
        )}
        {error || !networkConnection ? (
          <Button
            title="Exit"
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonText}
            onPress={handleClose}
          />
        ) : (
          <View style={styles.buttonsContainer}>
            <Button
              title="No"
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.buttonText}
              onPress={handleClose}
            />
            <Button
              title="Yes"
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.buttonText}
              onPress={handleYes}
            />
          </View>
        )}
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  // disabledButton: {
  //   backgroundColor: 'rgba(255, 255, 255, 0.4)',
  //   borderWidth: 1,
  //   borderColor: 'rgba(151, 151, 151, 0.4)'
  // },
  // buttonTextOpacity: {
  //   color: 'rgba(68, 68, 68, 0.4)',
  //   fontSize: 22,
  //   fontFamily: 'nunito-bold'
  // },
  // clickableText: {
  //   color: '#444444',
  //   fontSize: 22,
  //   fontFamily: 'nunito-bold'
  // },
  // iconStyle: {
  //   justifyContent: 'center'
  // },
  // buttonContainer: {
  //   alignContent: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: '#F2F6F8'
  // },
  // buttonTitle: {
  //   color: theme.white,
  //   fontSize: 18,
  //   fontFamily: 'nunito-regular'
  // },
  // manualDataButton: {
  //   backgroundColor: theme.red,
  //   width: 300,
  //   height: 50,
  //   borderRadius: 0,
  //   alignSelf: 'center',
  //   marginBottom: 40
  // },

  // =========================
  // Confirmation popup styles:
  overlay: { padding: 0, margin: 0 },
  closeButtonContainer: {
    position: 'absolute',
    right: 10,
    top: 0
  },
  closeButton: {},
  closeButtonTitle: { color: '#444444' },
  confirmationPopup: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
    height: '100%'
  },
  updateIconContainer: {
    paddingTop: 30,
    paddingBottom: 10
  },
  updateIcon: {
    width: 360,
    height: 360,
    backgroundColor: 'red'
  },
  confirmationTitle: {
    fontFamily: 'nunito-medium',
    fontSize: 32,
    color: theme.dark,
    marginBottom: 49,
    width: '100%',
    textAlign: 'center'
  },
  confirmationMessage: {
    fontFamily: 'nunito-light',
    fontSize: 22,
    color: theme.darkgray,
    marginBottom: 49,
    textAlign: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 50
  },
  buttonStyle: {
    backgroundColor: theme.green,
    height: 50,
    width: 260
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'nunito-bold'
  }
});
