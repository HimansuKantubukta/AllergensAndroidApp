import { StyleSheet } from 'react-native';
import theme from '../../styles/theme.style';

export default StyleSheet.create({
  backgroundImage: {
    flex: 1
  },
  content: {
    flex: 1,
    alignItems: 'center'
  },
  innerContent: {
    width: '100%',
    paddingHorizontal: 40
  },
  ingredientsStringContainer: {
    width: '100%',
    paddingVertical: 1
  },
  ingredientsString: {
    fontFamily: 'nunito-light',
    fontSize: 16,
    color: theme.dark
  },
  ingredientsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 1,
    paddingHorizontal: '20%',
    borderRadius: 5
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 100
  },
  bubblesContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'

  },
  box: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center'
  },
  title: {
    fontFamily: 'nunito-medium',
    fontSize: 28,
    color: theme.dark,
    paddingLeft: 30
  },
  subTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '25%'
  },
  subTitle: {
    fontFamily: 'nunito-light',
    fontSize: 18,
    textAlign: 'center',
    color: theme.darkgray
  },
  backContainer: {
    marginRight: 'auto'
  },
  recipeNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  /* WasteFriendly Recipe Logic --> Don't delete this  code as we might use this functionality later */
  // wasteFriendlyImagePositioning: {
  //   justifyContent: 'flex-start',
  //   position: 'absolute',
  //   left: 0,
  //   paddingLeft: 140
  // },
  priceContainer: {
    minWidth: 100,
    justifyContent: 'flex-end',
    marginLeft: 'auto'
  },
  wasteFriendlyStyle: {
    width: 50,
    height: 50
  },
  price: {
    marginLeft: 'auto',
    color: theme.darkgray,
    fontFamily: 'nunito-regular',
    fontSize: 20
  },
  dummyContainer: {
    width: 100
  },
  allergensBoxContainer: {
    paddingHorizontal: '20%',
    paddingTop: 20
  },
  allergensBox: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    borderRadius: 5
  },
  allergensTitle: {
    fontFamily: 'nunito-medium',
    fontSize: 26,
    color: theme.dark
  },
  allergensList: {
    padding: 5,
    paddingHorizontal: 10,
    width: '100%'
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
    paddingVertical: 10,
    flexWrap: 'wrap'
  },
  noAllergenBox: {
    backgroundColor: 'white',
    padding: 10
  },
  noAllergensBanner: {
    fontSize: 20,
    fontFamily: 'nunito-regular',
    color: theme.dark,
    margin: 70
  },
  allergenIconWrapper: {
    paddingVertical: 5
  },
  scrollView: {
    marginBottom: 150
  },
  servingType: {
    fontFamily: 'nunito-light',
    fontSize: 15,
    textAlign: 'center',
    color: theme.dark,
    paddingBottom: 4
  },
  intakeReferences: {
    fontFamily: 'nunito-light',
    fontSize: 12,
    textAlign: 'center'
  },
  NutritionAdvice: {
    paddingHorizontal: '20%',
    paddingTop: 20,
  },
  NutritionAdviceText: {
    fontFamily: 'nunito-light',
    fontSize: 15,
    color: theme.dark
  },
  NutritionAdviceBoldText: {
    fontFamily: 'nunito-light',
    fontSize: 15,
    fontWeight: 'bold'
  }
});
