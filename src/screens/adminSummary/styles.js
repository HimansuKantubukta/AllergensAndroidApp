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
  subtitle: {
    fontFamily: 'nunito-light',
    fontSize: 18,
    color: theme.darkgray,
    marginBottom: 32
  },
  scrollViewContainer: {
    paddingHorizontal: 100,
    flex: 1,
    height: 100,
    width: '100%'
  },
  scrollView: {
    width: '100%',
    height: 100,
    flex: 1,
    minHeight: 200
  },
  outlet: {
    flexDirection: 'row',
    minHeight: 200,
    backgroundColor: 'white',
    marginBottom: 30
  },
  outletMenuPlansContainer: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 30
  },
  dividerContainer: {
    justifyContent: 'center',
    flexDirection: 'column'
  },
  divider: {
    flex: 0.8,
    width: 1,
    backgroundColor: 'rgba(151, 151, 151, 0.35)'
  },
  menuName: {
    fontSize: 22,
    fontFamily: 'nunito-bold',
    color: theme.darkgray
  },
  mergedText: {},
  // =========================
  // Loading popup styles:
  loadingPopup: {
    top: 0,
    position: 'absolute'
  },
  completed: {
    fontSize: 30,
    fontFamily: 'nunito-regular',
    color: theme.white
  },
  loading: {
    fontSize: 22,
    fontFamily: 'nunito-regular',
    color: theme.white
  }
});
