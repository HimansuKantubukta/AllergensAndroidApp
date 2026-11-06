import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, CheckBox, Button } from 'react-native-elements';
import AdminHeader from '../../components/adminHeader';
import styles from './styles';
import AdminBottom from '../../components/adminBottom';
import AdminPageIndicator from '../../components/adminPageIndicator';
import theme from '../../styles/theme.style';
import AdminContext from '../../context/AdminContext';
import { outletSelectionLimit } from '../../../config/parameters';

export default function Outlets({ navigation, route }) {
  const adminContext = useContext(AdminContext);
  const [selectedOutletsLocal, setOutletSelected] = useState(
    adminContext.selectedOutlets.length > 0 ? adminContext.selectedOutlets : []
  );
  let { outlets } = route.params;
  if (!outlets) {
    outlets = [];
  }

  const isChecked = outletId => {
    return selectedOutletsLocal.find(e => e.id === outletId);
  };

  const checked = outletId => {
    return !!selectedOutletsLocal.find(e => e.id === outletId);
  };

  // const clickHandler = (id, name, unit) => () => {
  //   const filtered = selectedOutletsLocal.filter(outlet => outlet.id !== id);
  //   return checked(id)
  //     ? setOutletSelected(filtered)
  //     : setOutletSelected([...selectedOutletsLocal, { id, name, unit }]);
  // };

  const handleClearOutletSelections = () => {
    setOutletSelected([]);
  };

  const onOutletClicked = outlet => () => {
    const id = outlet.tradingOutletId;
    const name = outlet.tradingOutletName;
    const { unit, hidePrices, exempt, manualRefresh } = outlet;
    const isOutletChecked = isChecked(id);

    if (selectedOutletsLocal.length < outletSelectionLimit || isOutletChecked) {
      const filtered = selectedOutletsLocal.filter(outlet1 => outlet1.id !== id);
      return checked(id)
        ? setOutletSelected(filtered)
        : setOutletSelected([
          ...selectedOutletsLocal,
          { id, name, unit, hidePrices, exempt, manualRefresh }
        ]);
    } else {
      Alert.alert('Selection limit', `No more than ${outletSelectionLimit} Outlets can be selected`)
    }
  };


  const nextHandler = () => {
    outlets.forEach(outlet => {
      const updatedSelectedOutletLocal = selectedOutletsLocal.map((item, index) => {
        if (item.id === outlet.tradingOutletId) {
          const id = outlet.tradingOutletId;
          const name = outlet.tradingOutletName;
          const unit = outlet.unit;
          const { hidePrices, exempt, manualRefresh } = outlet;
          selectedOutletsLocal.splice(index, 1, { id, name, unit, hidePrices, exempt, manualRefresh });
        }
      });
    });

    // Make sure we only keep menu plans for the selected outlets.
    // first make sure we filter out items in selectedOutletsLocal if they are not in `outlets`
    const selectedOutlets = selectedOutletsLocal.filter(o =>
      outlets.find(o1 => o1.tradingOutletId === o.id)
    );

    let newMenuPlans = [];
    selectedOutlets.forEach(outlet => {
      newMenuPlans = [
        ...newMenuPlans,
        ...adminContext.selectedMenuPlans.filter(m => m.outletId === outlet.id)
      ];
    });
    adminContext.setSelectedMenuPlans(newMenuPlans);
    adminContext.setSelectedOutlets(selectedOutlets); // doing this here can be
    // considered a bug, means it saves on Next button.
    navigation.navigate('MenuPlans');
  };
  return (
    <AdminContext.Consumer>
      {({ setSelectedOutlets }) => (
        <View style={styles.container}>
          <AdminHeader />
          <Text style={styles.title}>Select Outlet(s) for this device</Text>
          <AdminPageIndicator active={'Outlets'} />
          <View style={styles.subHeader}>
            <Button
              title="Clear Selections"
              buttonStyle={styles.clearButtonStyle}
              titleStyle={styles.clearButtonText}
              onPress={handleClearOutletSelections}
              disabled={false}
            />
          </View>
          <ScrollView contentContainerStyle={{ paddingRight: 100 }}>
            {outlets &&
              outlets
                .sort((o1, o2) =>
                  `${o1.tradingOutletId}`.localeCompare(`${o2.tradingOutletId}`)
                )
                .map(outlet => (
                  <TouchableOpacity
                    key={outlet.tradingOutletId}
                    // onPress={clickHandler(
                    //   outlet.tradingOutletId,
                    //   outlet.tradingOutletName,
                    //   outlet.unit
                    // )}
                    onPress={onOutletClicked(outlet)}
                    activeOpacity={0.7}
                    style={[
                      styles.option,
                      checked(outlet.tradingOutletId) && styles.selected
                    ]}>
                    <Text style={styles.normalText}>
                      {outlet.tradingOutletId}
                      <Text style={styles.boldText}>
                        {` - ${outlet.tradingOutletName}`}
                      </Text>
                    </Text>

                    <CheckBox
                      containerStyle={styles.allergenCheckbox}
                      checked={checked(outlet.tradingOutletId)}
                      iconType="material-community"
                      checkedIcon="check-box-outline"
                      uncheckedIcon="checkbox-blank-outline"
                      // onPress={clickHandler(
                      //   outlet.tradingOutletId,
                      //   outlet.tradingOutletName,
                      //   outlet.unit
                      // )}
                      onPress={onOutletClicked(outlet)}
                      checkedColor={theme.darkgray}
                      uncheckedColor={theme.darkgray}
                    />
                  </TouchableOpacity>
                ))}
          </ScrollView>
          <AdminBottom
            outlets={selectedOutletsLocal}
            navigation={navigation}
            proceedButtonText="Next"
            nextHandler={nextHandler}
            saveOutlets={selectedOutlets => setSelectedOutlets(selectedOutlets)}
          />
        </View>
      )}
    </AdminContext.Consumer>
  );
}
