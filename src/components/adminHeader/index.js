import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import AdminContext from '../../context/AdminContext';
import DateText from '../../utils/date';
import Authentication from '../../services/Authentication';

export default function AdminHeader({ navigation, displayConsumerMode }) {
  const adminContext = React.useContext(AdminContext);
  //
  async function setToConsumerMode() {
    if (adminContext.authCode && adminContext.authCode !== '12345') {
      const logoutResult = await Authentication.logout();
      if (logoutResult) {
        adminContext.setAuthCode(null);
      }
    } else if (adminContext.authCode === '12345') {
      adminContext.setAuthCode(null);
    }
    navigation.navigate('ConsumerScreen');
  }

  return (
    <View style={styles.headerStyle}>
      <DateText style={styles.date} />
      {navigation && displayConsumerMode ? (
        <Text onPress={setToConsumerMode} style={styles.underlinedText}>
          Set to Consumer Mode
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50
  },
  date: {
    fontSize: 22,
    width: '30%',
    fontFamily: 'nunito-regular'
  },
  underlinedText: {
    textDecorationLine: 'underline',
    fontSize: 20,
    fontFamily: 'nunito-bold',
    color: '#2A2A2A',
    // increase padding so that it is easier to tap
    paddingBottom: 20,
    paddingHorizontal: 30
  }
});
