import * as React from "react";
import { Provider } from "react-redux";
import { store } from "./src/Dev 1/store/store";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./src/Dev 1/navigation/AppNavigator";
import { ThemeProvider } from "./src/Dev 1/ThemeContext";
import { SettingsProvider } from "./src/Dev 1/SettingsContext";
import ErrorBoundary from "./src/Dev 1/components/ErrorBoundary";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <Provider store={store}>
          <ThemeProvider>
            <SettingsProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </SettingsProvider>
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
