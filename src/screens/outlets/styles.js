import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#F2F6F8',
    paddingHorizontal: 40
  },
  subHeader: {
    width: '75%',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'flex-end',
    marginBottom: 10,
    marginRight: 35
  },
  title: {
    fontSize: 36,
    fontFamily: 'nunito-bold',
    marginBottom: 20
  },
  option: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    //backgroundColor: 'red',
    // marginVertical: 0,
    height: 65,
    width: '70%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderColor: '#979797',
    borderWidth: 1,
    alignSelf: 'center'
  },
  // lastOption: {
  //   borderBottomWidth: 2
  // },
  selected: {
    borderWidth: 2,
    borderColor: '#444444',
    borderBottomWidth: 2
  },
  disabledButton: {
    opacity: 0.4
  },
  normalText: {
    color: '#444444',
    fontSize: 22,
    fontFamily: 'nunito-regular'
  },
  boldText: {
    color: '#444444',
    fontSize: 22,
    fontFamily: 'nunito-bold'
  },
  iconStyle: {},
  allergenCheckbox: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0
  },
  clearButtonStyle: {
    width: 170,
    backgroundColor: 'grey',
    height: 45
  },
  clearButtonText: {
    color: 'white',
    fontFamily: 'nunito-bold',
    fontSize: 17
  }
});
