import { StyleSheet } from 'react-native';
import theme from '../../styles/theme.style';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#F2F6F8',
    paddingHorizontal: 40
  },
  title: {
    fontSize: 36,
    fontFamily: 'nunito-bold',
    marginBottom: 100
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 105,
    width: '60%',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    flexDirection: 'row',
    borderColor: '#979797',
    borderWidth: 1
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(151, 151, 151, 0.4)'
  },
  buttonTextOpacity: {
    color: 'rgba(68, 68, 68, 0.4)',
    fontSize: 22,
    fontFamily: 'nunito-bold'
  },
  clickableText: {
    color: '#444444',
    fontSize: 22,
    fontFamily: 'nunito-bold'
  },
  iconStyle: {
    justifyContent: 'center'
  },
  buttonContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6F8'
  },
  buttonTitle: {
    color: theme.white,
    fontSize: 18,
    fontFamily: 'nunito-regular'
  },
  manualDataButton: {
    backgroundColor: theme.red,
    width: 300,
    height: 50,
    borderRadius: 0,
    alignSelf: 'center',
    marginBottom: 40
  },
  longLoginWaitText: {
    fontSize: 22,
    fontFamily: 'nunito-bold',
    marginTop: 20
  }
});
