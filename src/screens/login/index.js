import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';
import { Text, Icon } from 'react-native-elements';
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';
import AdminContext from '../../context/AdminContext';
import theme from '../../styles/theme.style';
import { extractTokenInfoFromURLFragment } from '../../utils/auth-utils';
import AdminHeader from '../../components/adminHeader';
import styles from './styles';
import { AWSHostedUILoginURL } from '../../../config/urls';
import AuthTokenPopup from '../../components/popups/authTokenPopup';

const extra =
  Constants?.expoConfig?.extra || Constants?.manifest?.extra || {};
const isDebug =
  !!extra.debug ||
  extra.environment !== 'prd' ||
  (typeof __DEV__ !== 'undefined' && __DEV__);

// This is temporary until we have a login:

const devUserIds = [
  '06810254',
  '11415712',
  '11442635',
  '11447045',
  '11522623',
  '26810224'
];

const uatUserIds = [
  '11513191',
  '11522899',
  '06810254',
  '11448037',
  '11339679',
  '26810224',
  '11348568',
  '93854003',
  '02461273'
];

const userIds = devUserIds;

export default function HomeScreen({ navigation }) {
  const [authTokenPopupVisible, setAuthTokenPopupVisible] = React.useState(
    false
  );
  const { setAuthCode } = React.useContext(AdminContext);
  let url2;
  let url1;

  if (Linking.createURL) {
    url1 = Linking.createURL('/loggedin', { scheme: 'allergens' });
  }
  if (Linking.makeUrl) {
    url2 = Linking.makeUrl('/loggedin', null, 'allergens');
  }

  const redirectUri = url2 || url1; // 'exp://localhost:19000';
  const url = AWSHostedUILoginURL(redirectUri);

  function navToAdminHome(tokens) {
    setTimeout(
      () =>
        navigation.navigate('AdminHome', {
          id: userIds[2],
          bearerToken: tokens.id_token
        }),
      500
    );
  }

  function setAuthCodeAndRedirect(tokens) {
    setAuthCode(tokens.id_token);
    navToAdminHome(tokens);
  }

  async function loginWithOpenAuthSessionAsync() {
    const result = await WebBrowser.openAuthSessionAsync(url, redirectUri);
    if (result && result.url && result.type === 'success') {
      const tokens = extractTokenInfoFromURLFragment(result.url);
      setAuthCodeAndRedirect(tokens);
    }
  }

  function login() {
    loginWithOpenAuthSessionAsync();
  }

  function fakeLogin() {
    // all it does is set an AuthCode in the admin context.
    // Unless the calls to the api are mocked they will fail
    // with the fake authcode.
    const fakeAuthCode = { id_token: '12345' };
    setAuthCode(fakeAuthCode.id_token);
    navToAdminHome(fakeAuthCode);
  }

  function enterAuthToken() {
    setAuthTokenPopupVisible(true);
  }

  function handleSetAuthToken(authCode) {
    const fakeAuthCode = { id_token: authCode };
    setAuthCode(fakeAuthCode.id_token);
    setAuthTokenPopupVisible(false);
    navToAdminHome(fakeAuthCode);
  }

  function handleCancelAuthToken() {
    setAuthTokenPopupVisible(false);
  }

  return (
    <AdminContext.Consumer>
      {({ authCode }) => (
        <View style={styles.container}>
        <View style={styles.subContainer}>
          {/* <WebView
            source={{ uri: url }}
            onNavigationStateChange={onNavigationStateChange}
          /> */}
          <AdminHeader navigation={navigation} displayConsumerMode />
          <Text style={styles.title}>Restricted Administration Area</Text>
          <TouchableOpacity
            onPress={() => login()}
            activeOpacity={0.7}
            style={[styles.button]}>
            <Text style={styles.clickableText}>Login with Compass</Text>
            <Icon
              containerStyle={styles.iconStyle}
              name="keyboard-arrow-right"
              size={40}
              color="black"
            />
          </TouchableOpacity>
          {/* Display a fake login button if running in development */}
          {isDebug ? (
            <TouchableOpacity
              onPress={() => fakeLogin()}
              activeOpacity={0.7}
              style={[styles.button]}>
              <Text style={styles.clickableText}>
                [Debug] Fake Login (uses '12345' as auth token)
              </Text>
              <Icon
                containerStyle={styles.iconStyle}
                name="keyboard-arrow-right"
                size={40}
                color="black"
              />
            </TouchableOpacity>
          ) : null}
          {/* Allow manually entering the auth token */}
          {isDebug ? (
            <>
              <AuthTokenPopup
                visible={authTokenPopupVisible}
                handleOK={handleSetAuthToken}
                handleCancel={handleCancelAuthToken}
              />
              <TouchableOpacity
                onPress={() => enterAuthToken()}
                activeOpacity={0.7}
                style={[styles.button]}>
                <Text style={styles.clickableText}>
                  [Debug] Enter auth token manually
                </Text>
                <Icon
                  containerStyle={styles.iconStyle}
                  name="keyboard-arrow-right"
                  size={40}
                  color="black"
                />
              </TouchableOpacity>
            </>
          ) : null}
          {isDebug ? (
            <View
              style={[
                { width: '10%', margin: 10, backgroundColor: '#F2F6F8' }
              ]}>
              <Text>Debug information ( to be removed ): </Text>
              <Button
                style={{ margin: 10 }}
                buttonStyle={styles.buttonStyle}
                conta
                key="debugBtn"
                title="Debug Log"
                onPress={() => navigation.navigate('AdminLog')}
              />
              <Text>redirectUri: {redirectUri}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.footerStyle}>
            <Text>App version: {Constants.manifest.version}</Text>
          </View>
        </View>
      )}
    </AdminContext.Consumer>
  );
}
