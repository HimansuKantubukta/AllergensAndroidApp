import React, { useContext } from 'react';
import { Text } from 'react-native';
import { format } from 'date-fns';
import RecipesContext from '../context/RecipesContext';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export default function DateText({ style }) {
  const recipesContext = useContext(RecipesContext);

  const d = recipesContext.currentDay;

  return <Text style={style}>{format(d, 'EEEE do LLLL')}</Text>;
}
