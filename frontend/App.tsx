import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/Dev 1/store/store';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/Dev 1/navigation/AppNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
