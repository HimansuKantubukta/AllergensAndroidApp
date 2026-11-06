import { StatusBar, StyleSheet } from 'react-native';
import theme from '../../styles/theme.style';

export default StyleSheet.create({
  dietaryReqsBtn: {
    backgroundColor: theme.red,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    width: 320,
    minHeight: 50
  },
  resetContainer: {
    marginLeft: 18
  },
  dummyReset: {
    width: 50,
    // backgroundColor: 'green',
    marginRight: 18
  },
  firstCol: {
    flex: 0.3,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  secondCol: {
    // flex: 0.3,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
    // backgroundColor: 'red'
  },
  thirdCol: {
    flex: 0.3,
    alignItems: 'flex-end',
    alignSelf: 'center'
  },
  homeIcon: {
    width: 75,
    height: 75,
    marginRight: 8
  },
  homeText: {
    fontFamily: 'nunito-bold',
    fontSize: 18,
    color: theme.white,
    textDecorationLine: 'underline',
    marginRight: 40
  },
  resultsContainer: {
    width: '100%',
    position: 'absolute',
    top: -22
  },
  bold: {
    fontWeight: 'bold'
  },
  input: {
    height: 45,
    width: '80%',
    backgroundColor: theme.white,
    borderBottomWidth: 0
  },
  flatList: {
    minHeight: 66,
    maxHeight: 146,
    width: '100%',
    borderTopWidth: 1,
    paddingHorizontal: 10,
    borderTopColor: theme.dark,
    backgroundColor: theme.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  listItem: {
    flexWrap: 'wrap',
    marginVertical: 4
  },
  reset: {
    fontFamily: 'nunito-bold',
    fontSize: 14,
    letterSpacing: 1.5,
    color: theme.offwhite,
    textDecorationLine: 'underline'
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 40
    //backgroundColor: 'red'
  },
  headerSecondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 40
    //backgroundColor: 'red'
  },
  search: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%'
  },
  searchValue: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomColor: theme.white,
    borderBottomWidth: 1,
    width: '100%'
  },
  buttonText: {
    fontFamily: 'nunito-bold',
    fontSize: 18,
    textTransform: 'capitalize'
  },
  dateText: {
    color: theme.white,
    fontFamily: 'nunito-regular',
    fontSize: 18,
    letterSpacing: 1.2,
    lineHeight: 28
  },
  text: {
    color: theme.white,
    fontFamily: 'nunito-medium',
    fontSize: 18
  },
  closedSearchText: {
    color: '#777777',
    fontFamily: 'nunito-medium',
    fontSize: 18,
    marginRight: 5,
    fontWeight: '500',
    letterSpacing: 0.45
  },
  searchIcon: {
    marginLeft: 16,
    width: 40,
    height: 40
  },
  allergensIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    flex: 1,
    justifyContent: 'space-between'
  },
  dummyEl: {
    flex: 0.2,
    color: 'white',
    textAlign: 'right',
    fontFamily: 'nunito-medium'
  },
  allergensText: {
    color: '#979797',
    fontFamily: 'nunito-medium',
    textAlign: 'center',
    fontSize: 13
  },
  allergenIconText: {
    fontFamily: 'nunito-medium',
    fontSize: 14,
    color: theme.white,
    marginTop: 5
  },
  column: {
    minWidth: 250,
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 5,
    minHeight: 120
  },
  centered: {
    justifyContent: 'center'
  },
  iconsContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    maxWidth: 450,
    minWidth: 170,
    marginVertical: 10
  },
  rightIconsContainer: {
    borderLeftColor: 'rgba(119,119,119,0.75)',
    borderLeftWidth: 2
  },
  allergenSeparator: {
    borderColor: 'rgba(119,119,119,0.75)',
    // borderLeftWidth: 2,
    borderWidth: 1,
    width: 1,
    height: 60,
    marginTop: 20,
    marginBottom: 20,
  },

  textMore: {
    width: 48,
    color: theme.white,
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontSize: 10,
    marginTop: 10,
    fontFamily: 'nunito-medium'
  },
  whitePoints: {
    color: theme.white,
    textAlign: 'center',
    lineHeight: 10,
    height: 10,
    marginTop: 0,
    paddingTop: 0
  },
  marginBottom: {
    marginBottom: 20,
    width: 60
  },
  outletSelectorContainer: {
    flex: 0.2,
    color: 'white',
    justifyContent: 'flex-end',
    flexDirection: 'row'
  }
});
