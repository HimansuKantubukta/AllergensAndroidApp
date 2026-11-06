import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Overlay, Button } from 'react-native-elements';
import theme from '../../styles/theme.style';

export default function GenericOkCancelPopup({
  width,
  height,
  visible,
  handleCancel,
  handleOk,
  children,
  okText
}) {
  return (
    <Overlay
      width={width || 620}
      height={height || 370}
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
          onPress={handleCancel}
        />
        <View style={styles.childrenWrapper}>{children}</View>
        <View style={styles.buttonsContainer}>
          <Button
            title="Cancel"
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonText}
            onPress={handleCancel}
          />
          <Button
            title={okText || 'OK'}
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonText}
            onPress={handleOk}
          />
        </View>
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  childrenWrapper: {
    padding: 30
  },
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
