import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  TextInput
} from 'react-native';
import AdminContext from '../../context/AdminContext';
import {
  registerForPushNotificationsAsync,
  registerPushNotificationReceivedInForeground,
  registerPushNotificationClicked
} from '../../services/Notifications';

export default function AdminLog({ navigation }) {
  const [token, setToken] = useState('');
  //
  async function generateToken(insertLogMessage) {
    try {
      const token1 = await registerForPushNotificationsAsync(insertLogMessage);
      setToken(token1);
      insertLogMessage(`pushNotificationSetup: Got a push token ${token1}`);
    } catch (error) {
      insertLogMessage(`generateToken: Got an error!`);
      insertLogMessage(`generateToken: Error: ${JSON.stringify(error)}`);
    }
  }

  /**
   *
   * @param {*} insertLogMessage
   */
  function registerForNotifications(insertLogMessage) {
    insertLogMessage('registerForNotifications: called');
    registerPushNotificationReceivedInForeground(notification => {
      insertLogMessage(
        `Notification received: ${JSON.stringify(notification)}`
      );
    });

    registerPushNotificationClicked(response => {
      insertLogMessage(
        `registerPushNotificationClicked: Got a response: ${response}`
      );
    });
  }

  return (
    <AdminContext.Consumer>
      {({ logMessages, insertLogMessage }) => (
        <View style={styles.logContainer}>
          <ScrollView style={styles.scrollView}>
            {logMessages.map((m, idx) => (
              <Text key={idx} style={styles.message}>
                {m}
              </Text>
            ))}
          </ScrollView>
          <View style={styles.buttonsContainer}>
            <Button title="Back" onPress={() => navigation.goBack()} />
            <Button
              title="Generate push notification token"
              onPress={() => generateToken(insertLogMessage)}
            />

            <Button
              title="Register for notifications"
              onPress={() => registerForNotifications(insertLogMessage)}
            />
            <Button
              title="Test message"
              onPress={() => insertLogMessage('Test message.')}
            />
            <Button
              title="Display recipe data"
              onPress={() => navigation.navigate('DebugRecipes')}
            />
          </View>
          <TextInput value={token} />
        </View>
      )}
    </AdminContext.Consumer>
  );
}

const styles = StyleSheet.create({
  logContainer: {
    padding: 20
  },
  scrollView: {
    height: '80%',
    marginBottom: 10
  },
  message: {
    color: 'black',
    fontSize: 20
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
});
