import * as React from "react";
import { Provider } from "react-redux";
import { store } from "./src/Dev 1/store/store";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./src/Dev 1/navigation/AppNavigator";
import { ThemeProvider } from "./src/Dev 1/ThemeContext";
import { SettingsProvider } from "./src/Dev 1/SettingsContext";
import ErrorBoundary from "./src/Dev 1/components/ErrorBoundary";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// i18n imports
import "./src/Dev 1/i18n";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./src/Dev 1/i18n";
import { Text } from "react-native";

function DemoWelcome() {
  const { t } = useTranslation();
  return (
    <>
      {/* Example: Remove this after confirming i18n works */}
      <React.Fragment>
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 18 }}>
          {t("welcome")}
        </Text>
      </React.Fragment>
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <Provider store={store}>
          <ThemeProvider>
            <SettingsProvider>
              <I18nextProvider i18n={i18n}>
                <NavigationContainer>
                  {/* Demo translation, remove after confirming */}
                  {/* <DemoWelcome /> */}
                  <AppNavigator />
                </NavigationContainer>
              </I18nextProvider>
            </SettingsProvider>
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
