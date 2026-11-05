/* eslint-disable prefer-template */
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Overlay, Text, Icon } from 'react-native-elements';
import theme from '../../styles/theme.style';

export default function LoadingPopup({ visible, loading, done, error }) {
  return (
    <Overlay
      height={180}
      overlayStyle={[styles.loadingPopup]}
      containerStyle={styles.overlayContainer}
      animationType="fade"
      transparent
      onRequestClose={() => {}}
      isVisible={visible}
      windowBackgroundColor="rgba(0,0,0,0.7)"
      overlayBackgroundColor="#2A2A2A">
      <View style={styles.overlayContainerInner}>
        {loading && (
          <View style={styles.confirmationPopup}>
            <Text style={styles.loading}>Data being downloaded...</Text>
            <ActivityIndicator size={64} color="#F2F2F2" />
          </View>
        )}
        {done && (
          <View style={[styles.confirmationPopup]}>
            <Text style={styles.completed}>Complete</Text>
            <Icon
              size={44}
              color="#1F7C25"
              type="material-community"
              name="check-circle-outline"
            />
          </View>
        )}
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  // =========================
  // Loading popup styles:
  loadingPopup: {
    top: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%'
  },
  completed: {
    fontSize: 30,
    fontFamily: 'nunito-regular',
    color: theme.white
  },
  loading: {
    fontSize: 22,
    fontFamily: 'nunito-regular',
    color: theme.white
  },
  overlayContainerInner: {
    height: 180,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  confirmationPopup: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
    height: 180
  }
});
