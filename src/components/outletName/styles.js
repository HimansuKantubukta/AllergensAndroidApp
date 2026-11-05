import { StyleSheet } from 'react-native';
import theme from '../../styles/theme.style';

export default StyleSheet.create({
  outletNameContainer: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    // backgroundColor: 'red',
    padding: 30
  },
  nameId: {
    color: theme.darkgray,
    fontSize: 20,
    fontFamily: 'nunito-regular'
  },
  nameOutlet: {
    color: theme.darkgray,
    fontSize: 28,
    fontFamily: 'nunito-bold'
  },
  nameOutletOriginalEditable: {
    fontSize: 18,
    color: theme.darkgray
  },
  nameOutletEditable: {
    color: theme.darkgray,
    fontSize: 28,
    fontFamily: 'nunito-bold',
    paddingHorizontal: 0
  },
  nameOutletInputContainer: {
    padding: 0,
    margin: 0,
    marginTop: 10,
    marginHorizontal: -8 // move it to the left
  },
  nameOutletInputInput: {},
  nameOutletInputInputContainer: {},
  originalOutletName: {
    color: theme.darkgray,
    fontSize: 18,
    fontFamily: 'nunito-regular'
  }
});
