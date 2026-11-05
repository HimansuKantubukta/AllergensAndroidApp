import { StatusBar, StyleSheet } from 'react-native';
import theme from '../../styles/theme.style';

export default StyleSheet.create({
  overlay: {
    // width: 400
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleContainer: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    marginTop: 10
  },
  closeButtonContainer: {
    position: 'absolute',
    right: 5,
    top: -5
  },
  closeButton: {},
  closeButtonTitle: { color: '#444444' },
  title: {
    fontSize: 34,
    fontFamily: 'nunito-bold',
    textAlign: 'center',
    color: theme.dark,
    marginTop: 10,
    alignItems: 'center'
  },
  subTitleContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 5
  },
  ContainMayContain: {
    fontWeight: 'bold'
  },
  subTitle: {
    fontSize: 24,
    fontFamily: 'nunito-medium',
    textAlign: 'center'
  },
  panelTitleInnerContainer: {
    flexDirection: 'row',
    color: theme.dark,
    fontFamily: 'nunito-medium'
  },
  panelTitleContainer: {
    color: theme.dark,
    marginTop: 20,
    textDecorationLine: 'underline',
    fontFamily: 'nunito-medium'
  },
  panelTitle: {
    fontFamily: 'nunito-medium',
    fontSize: 18,
    textDecorationLine: 'underline',
    letterSpacing: 1,
    color: theme.dark
  },
  panelTitleArrow: {
    marginHorizontal: 10
  },
  saveButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoContainer: {
    marginTop: 20,
    borderTopColor: 'rgba(151,151,151,0.5)',
    borderTopWidth: 1,
    padding: 20,
    fontFamily: 'nunito-regular',
    color: '#444444',
    fontSize: 16,
    flexDirection: 'row'
  },
  infoIcon: {
    color: '#444444'
  },
  info: {
    marginHorizontal: 5,
    color: '#444444',
    fontSize: 16,
    fontFamily: 'nunito-regular',
    letterSpacing: 0.89
  },
  emptyPanel: {
    height: 197
  },
  allergensSectionIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    width: 700,
    paddingVertical: 0
  },
  allergensSectionIconsContainerMay: {
    paddingTop: 0,
  
  }
});
