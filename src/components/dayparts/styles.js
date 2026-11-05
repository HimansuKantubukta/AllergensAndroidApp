import { StyleSheet } from 'react-native';
import theme from '../../styles/theme.style';

export default StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 30
    //backgroundColor: 'orange'
  },
  scrollView: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  bullets: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 5
  },
  bullet: {
    paddingHorizontal: 5,
    fontSize: 20
  },
  stat: {
    paddingHorizontal: 5,
    paddingBottom: 5,
    paddingTop: 5,
    width: 200,
    backgroundColor: theme.darkgray,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    margin: 5,
    marginTop: 0,
    marginBottom: 10,
    height: 60,
    borderBottomWidth: 5
  },
  dayPartButtonText: {
    paddingHorizontal: 4,
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    flexWrap: 'wrap',
    fontWeight: 'bold',
    color: theme.offwhite,
    fontFamily: 'nunito-bold',
    letterSpacing: 1
  },
  daypartsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 170
  },
  daypartsContainerLessThan5: {
    marginLeft: 0,
    justifyContent: 'center',
    height: 'auto',
    paddingTop: 0,
    paddingBottom: 20
  }
});
