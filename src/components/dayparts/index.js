import React, {
  useState,
  useEffect,
  createRef,
  useRef,
  useContext
} from 'react';
// import _ from 'lodash';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import uniqBy from 'ramda/src/uniqBy';
import MenuContext from '../../context/MenuContext';
import styles from './styles';
import theme from '../../styles/theme.style';

function menuIdToIndex(menuId, data) {
  return Math.max(
    data.menu_plans.findIndex(m => m.id === menuId),
    0
  );
}

const DayPartButton = ({ label, navigation, menuId, id }) => {
  const { data } = useContext(MenuContext);
  const menuColors = [
    theme.yellow,
    theme.green,
    theme.purple,
    theme.red,
    theme.dark
  ];

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('DayPart', { id, label, fullScreen: true })
      }
      activeOpacity={0.7}
      style={[
        styles.stat,
        { borderBottomColor: menuColors[menuIdToIndex(menuId, data)] }
      ]}>
      <Text style={styles.dayPartButtonText}>{label}</Text>
    </TouchableOpacity>
  );
};

/**
 * Returns the width of the container with the menu plans buttons.
 * We want these buttons to go up to two rows. It needs to be wide
 * enough to never display a third row of buttons
 * (instead, it scrolls to the right).
 * @param {Array} itemsArr
 */
export function computeContainerWidth(itemsArr) {
  // Each button is about 232.
  return Array.isArray(itemsArr)
    ? Math.ceil(itemsArr.length / 2) * 243 + 10
    : 0;
}

/**
 *
 */
export default DayParts = ({ navigation, items, itemsPerInterval }) => {
  const scrollRef = useRef();

  const nonRepeatedItems = uniqBy(x => x.description, items).filter(
    item => item.description !== '' && item.dayPartCode !== ''
  );

  if (nonRepeatedItems.length <= 1) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {nonRepeatedItems.length < 10 ? (
        <View
          style={[
            styles.daypartsContainer,
            nonRepeatedItems.length < 5
              ? styles.daypartsContainerLessThan5
              : null
          ]}>
          {nonRepeatedItems.map((dayPart, index) => (
            <DayPartButton
              key={index}
              navigation={navigation}
              id={dayPart.id}
              menuId={dayPart.menu_plan}
              label={dayPart.description}
            />
          ))}
        </View>
      ) : (
        <ScrollView
          ref={ref => {
            scrollRef.current = ref;
          }}
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={{
            ...styles.scrollView,
            width: computeContainerWidth(nonRepeatedItems)
          }}
          scrollEventThrottle={200}>
          <View style={styles.daypartsContainer}>
            {nonRepeatedItems.map((dayPart, index) => (
              <DayPartButton
                key={index}
                navigation={navigation}
                id={dayPart.id}
                menuId={dayPart.menu_plan}
                label={dayPart.description}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

// Unnecessary code. FIXME

// const localItemsPerInterval =
//   itemsPerInterval === undefined ? 1 : itemsPerInterval;
// const [interval, setInterval] = useState(1);
// const [intervals, setIntervals] = useState(1);
// const [width, setWidth] = useState(0);
// /**
//  *
//  */
// const init = (customWidth = width) => {
//   // // initialise width
//   // setWidth(customWidth);
//   // // initialise total intervals
//   // const totalItems = items.length / 2;
//   // const newIntervals = Math.ceil(totalItems / localItemsPerInterval);
//   // if (newIntervals < 2) {
//   //   if (scrollRef && scrollRef.current) {
//   //     scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
//   //   }
//   // }
//   // setIntervals(Math.ceil(totalItems / localItemsPerInterval));
// };
// useEffect(() => init(), [items]);

// const getInterval = offset => {
//   for (let i = 1; i <= intervals; i++) {
//     if (offset < (width / intervals) * i) {
//       return i;
//     }
//     if (i == intervals) {
//       return i;
//     }
//   }
// };

// let bullets = [];
// for (let i = 1; i <= intervals; i++) {
//   bullets.push(
//     <Text
//       key={i}
//       style={{
//         ...styles.bullet,
//         opacity: interval === i ? 0.5 : 0.1
//       }}>
//       &bull;
//     </Text>
//   );
// }
