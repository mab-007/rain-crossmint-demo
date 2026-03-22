import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import CrossmintProviders from "./providers/CrossmintProviders";
import AppNavigator from "./navigation/AppNavigator";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <CrossmintProviders>
        <AppNavigator />
      </CrossmintProviders>
    </ThemeProvider>
  );
}

