import { StyleSheet } from 'react-native';
import theme from '../../styles/theme.style';

export default StyleSheet.create({
  allergensTitle: {
    fontFamily: 'nunito-medium',
    fontSize: 26,
    color: theme.dark
  },
  allergensList: {
    padding: 0,
    paddingHorizontal: 20
  },
  allergesListBorder: {
    borderBottomWidth: 1,
    borderColor: 'rgba(151, 151, 151, 0.25)'
  },
  allergensListTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    paddingVertical: 0
  },
  allergensListTitle: {
    fontFamily: 'nunito-medium',
    fontSize: 22,
    color: theme.dark
  },
  allergensListIconsContainer: {
    flexDirection: 'row',
    paddingVertical: 8
  },
  tooltipContainerStyle: {
    backgroundColor: 'white',
    borderColor: 'rgba(151,151,151,0.25)',
    borderWidth: 1,
    width: 320,
    height: 250,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2
  }
});
