import { StyleSheet } from 'react-native';
import theme from '../../styles/theme.style';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 40,
    backgroundColor: '#F2F6F8'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20
  },
  title: {
    fontSize: 36,
    fontFamily: 'nunito-bold',
    marginBottom: 0
  },
  dummy: {
    width: 100
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '80%',
    flex: 1,
    borderColor: '#F2F2F2',
    borderWidth: 1,
    alignSelf: 'center',
    marginVertical: 10,
    paddingVertical: 20
  },
  menu: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 60,
    width: '100%',
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: '#979797',
    borderWidth: 1,
    borderBottomWidth: 0,
    alignSelf: 'center'
  },
  menuPlanOrderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 440
  },
  menuLast: { borderBottomWidth: 1 },
  selected: {
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#444444'
  },
  normalText: {
    color: '#444444',
    fontSize: 22,
    fontFamily: 'nunito-regular'
  },
  boldText: {
    color: '#444444',
    fontSize: 16,
    fontFamily: 'nunito-bold'
  },
  allergenCheckbox: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0
  },
  outletText: {
    width: '40%',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 28
  },
  noMenuPlans: {
    width: '60%',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 20
  },
  editNameInput: {
    color: theme.darkgray,
    fontSize: 26,
    fontFamily: 'nunito-bold',
    borderBottomWidth: 1
  },
  downButton: {
    marginLeft: 10
  },
  upDownButton: {
    backgroundColor: theme.white,
    margin: 2,
    borderWidth: 1,
    borderColor: theme.dark
  },
  upDownButtonIcon: {
    color: theme.dark
  },
  singleSwapButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  singleSwapButton: {
    marginLeft: 10
  },
  checkOptionTextStyle: {
    fontFamily: 'nunito-regular',
    fontSize: 16,
    fontWeight: 'normal'
  }
});
