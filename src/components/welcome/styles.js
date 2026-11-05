import { StyleSheet } from 'react-native';
import theme from '../../styles/theme.style';

export default StyleSheet.create({
  welcome: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 50
  },
  welcomeImage: {
    width: 86,
    height: 86
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: 'nunito-regular',
    color: theme.darkgray,
    width: 400,
    textAlign: 'center'
  }
});
