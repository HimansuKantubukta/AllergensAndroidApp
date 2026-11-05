import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Button, View, Text, StyleSheet } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import theme from '../../styles/theme.style';
import DietaryRequirements from '../../components/dietaryRequirements';

const userIds = [
  '06810254',
  '11415712',
  '11442635',
  '11447045',
  '11522623',
  '26810224'
];
export default function HomeScreen({ navigation }) {
  let [modalVisible, setModalVisible] = React.useState(false);

  // const url = 'http://192.168.1.177:3000/';
  const url =
    'https://keytree-test.auth.eu-west-1.amazoncognito.com/login?client_id=7056pl69a27g6vvpemn7d67tms&response_type=code&scope=aws.cognito.signin.user.admin&redirect_uri=allergens://';

  return (
    <View style={{ flex: 1, padding: 60, backgroundColor: theme.background }}>
      <Text style={{ textAlign: 'center' }}>
        Example Screen: select user ID
      </Text>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-evenly',
          flexDirection: 'row'
        }}>
        {userIds.map(id => (
          <Button
            style={{ margin: 10 }}
            key={id}
            title={id}
            onPress={() => navigation.navigate('AdminHome', { id })}
          />
        ))}
        {/* <Text>Login Screen</Text>
      <DietaryRequirements visible={modalVisible} />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button
        title="Go to Day part view"
        onPress={() => navigation.navigate('DayPart')}
      />
      <Button title="Show modal" onPress={() => setModalVisible(true)} /> */}
      </View>
      <View style={[{ width: '10%', margin: 10, backgroundColor: '#F2F6F8' }]}>
        <Button
          style={{ margin: 10 }}
          buttonStyle={styles.buttonStyle}
          conta
          key="debugBtn"
          title="Debug Log"
          onPress={() => navigation.navigate('AdminLog')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#5BB4B1',
    height: 50
  }
});
