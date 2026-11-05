import { StyleSheet } from 'react-native';
import theme from '../../styles/theme.style';

export default StyleSheet.create({
  recipesNoResults: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 50
  },
  noResultsImage: {
    width: 76,
    height: 86
  },
  noResultsText: {
    fontSize: 28,
    fontFamily: 'nunito-regular',
    color: theme.darkgray,
    width: 400,
    textAlign: 'center'
  }
});
