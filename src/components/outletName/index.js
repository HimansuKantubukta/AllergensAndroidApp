import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Input } from 'react-native-elements';
import styles from './styles';

export default function OutletName({
  outletId,
  originalName,
  name,
  editable,
  onFocus
}) {
  return (
    <View style={styles.outletNameContainer}>
      <Text style={styles.nameId}>{outletId}</Text>
      {!editable ? (
        <Text style={styles.nameOutlet}>{name}</Text>
      ) : (
        <>
          <Text style={styles.nameOutletOriginalEditable}>{originalName}</Text>
          <TouchableOpacity onPress={onFocus}>
            <Input
              containerStyle={styles.nameOutletInputContainer}
              inputContainerStyle={styles.nameOutletInputInputContainer}
              inputStyle={styles.nameOutletInputInput}
              editable={false}
              onClick={onFocus}
              style={styles.nameOutletEditable}>
              {name}
            </Input>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
