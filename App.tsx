import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import CrossmintProviders from "./providers/CrossmintProviders";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <CrossmintProviders>
      <StatusBar style="light" />
      <AppNavigator />
    </CrossmintProviders>
  );
}

