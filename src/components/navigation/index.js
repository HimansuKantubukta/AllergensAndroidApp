/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { PanResponder, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import theme from '../../styles/theme.style';
import AdminHome from '../../screens/adminHome';
import Outlets from '../../screens/outlets';
import AdminSummary from '../../screens/adminSummary';
import AdminLog from '../../screens/adminLog';
import DebugRecipes from '../../screens/debugRecipes';
import HomeScreen from '../../screens/home';
import LoginScreen from '../../screens/login';
import DayPart from '../../screens/daypart';
import RecipeDetails from '../../screens/recipe';
import MenuPlans from '../../screens/adminMenuPlans';
import { inactivityTimeoutMs } from '../../../config/parameters';
import CustomHeader from './customHeader';

const Stack = createStackNavigator();
const StackWrapper = createStackNavigator();
const AdminStack = createStackNavigator();
const AppStack = createStackNavigator();

const Admin = () => (
  <AdminStack.Navigator
    initialRouteName="Login"
    screenOptions={{ animationEnabled: false, headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <AdminStack.Screen name="AdminHome" component={AdminHome} />
    <AdminStack.Screen name="Outlets" component={Outlets} />
    <AdminStack.Screen name="MenuPlans" component={MenuPlans} />
    <AdminStack.Screen name="AdminSummary" component={AdminSummary} />
    <AdminStack.Screen name="AdminLog" component={AdminLog} />
    <AdminStack.Screen name="DebugRecipes" component={DebugRecipes} />
  </AdminStack.Navigator>
);

const WrapperStack = ({ inactivityReset }) => (
  <StackWrapper.Navigator
    initialRouteName="HomeNavigation"
    screenOptions={{
      header: (headerProps) => {
        const options =
          headerProps.options ||
          headerProps.scene?.descriptor?.options ||
          {};
        const navigation = headerProps.navigation;
        return (
          <CustomHeader
            options={options}
            navigation={navigation}
            inactivityReset={inactivityReset}
          />
        );
      },
      headerStyle: {
        height: 200, // Specify the height of your custom header
        minHeight: 185,
        backgroundColor: theme.dark
      }
    }}>
    <StackWrapper.Screen
      name="HomeNavigation"
      component={ConsumerStack}
      options={{
        headerStyle: {
          height: 200,
          backgroundColor: theme.dark
        }
      }}
    />
  </StackWrapper.Navigator>
);

const ConsumerStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />

    <Stack.Screen
      name="DayPart"
      component={DayPart}
      initialParams={{ fullScreen: true }}
    />

    <Stack.Screen name="RecipeDetails" component={RecipeDetails} />
  </Stack.Navigator>
);
export default class Navigation extends React.Component {
  state = {
    inactivityReset: false
  };
  _panResponder = {};
  timer = 0;

  async componentDidMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        this.resetTimer();
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 15 || gestureState.dx > 15;
      },
      onStartShouldSetPanResponderCapture: () => {
        this.resetTimer();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false
    });
    this.timer = setTimeout(
      () => this.setState({ inactivityReset: true }),
      inactivityTimeoutMs
    );
  }

  resetTimer = () => {
    clearTimeout(this.timer);
    if (this.state.inactivityReset) this.setState({ inactivityReset: false });
    this.timer = setTimeout(
      () => this.setState({ inactivityReset: true }),
      inactivityTimeoutMs
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }} {...this._panResponder.panHandlers}>
        <AppStack.Navigator
          initialRouteName="ConsumerScreen "
          screenOptions={{ headerShown: false }}>
          <AppStack.Screen name="ConsumerScreen">
            {props => (
              <WrapperStack
                {...props}
                inactivityReset={this.state.inactivityReset}
              />
            )}
          </AppStack.Screen>
          <AppStack.Screen name="AdminWrapper" component={Admin} />
        </AppStack.Navigator>
      </View>
    );
  }
}
