import { createRef } from 'react';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createRef();

export const getCurrentRoute = () => {
  let rootState = navigationRef.current.getRootState();
  let route = rootState.routes[rootState.index];

  while (route.state) {
    route = route.state.routes[route.state.index];
  }
  return route;
};

export function navigate(name, params) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}
