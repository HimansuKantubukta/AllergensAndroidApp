import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  TextInput
} from 'react-native';
import AdminContext from '../../context/AdminContext';
import DeviceStorage from '../../services/DeviceStorage';

/**
 * DebugRecipe is a debug component that displays the flat
 * structure of the recipe data being displayed. It reads
 * directly from the device storage.
 */
export default function debugRecipes({ navigation }) {
  const [flatOutlet, setFlatOutlet] = useState({ noData: true });

  useEffect(() => {
    async function setup() {
      const readFlatOutlet = await DeviceStorage.readFlatOutlet();
      if (readFlatOutlet) {
        setFlatOutlet(readFlatOutlet);
      }
    }
    setup();
    return () => {}; // cleanup function
  }, []);

  return (
    <AdminContext.Consumer>
      {({ logMessages, insertLogMessage }) => (
        <View style={styles.logContainer}>
          <TextInput
            multiline
            lines={20}
            value={JSON.stringify(flatOutlet, null, 2)}
          />
          <Button title="Back" onPress={() => navigation.goBack()} />
        </View>
      )}
    </AdminContext.Consumer>
  );
}

const styles = StyleSheet.create({
  logContainer: {
    padding: 20,
    height: '100%',
    width: '100%'
  },
  scrollView: {
    height: '80%',
    marginBottom: 10
  },
  message: {
    color: 'black',
    fontSize: 20
  }
});
