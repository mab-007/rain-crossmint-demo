import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useCrossmintAuth } from "@crossmint/client-sdk-react-native-ui";
import { ActivityIndicator, View, StyleSheet, Text as RNText } from "react-native";
import { Home, DollarSign, CreditCard, History, PlusCircle, Send } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../context/ThemeContext";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import BalancesScreen from "../screens/BalancesScreen";
import FundScreen from "../screens/FundScreen";
import TransferScreen from "../screens/TransferScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import SendTxScreen from "../screens/SendTxScreen";
import CardScreen from "../screens/CardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import InsightsScreen from "../screens/InsightsScreen";
import CashDetailsScreen from "../screens/CashDetailsScreen";
import LandingScreen from "../screens/LandingScreen";
import ExploreScreen from "../screens/ExploreScreen";
import CardSettingsScreen from "../screens/CardSettingsScreen";
import ExchangeScreen from "../screens/ExchangeScreen";
import HelpSupportScreen from "../screens/HelpSupportScreen";

export type RootStackParamList = {
    Landing: undefined;
    Login: undefined;
    Main: undefined;
    Balances: undefined;
    Fund: undefined;
    Transactions: undefined;
    SendTx: undefined;
    Profile: undefined;
    Insights: undefined;
    CashDetails: undefined;
    Explore: undefined;
    CardSettings: undefined;
    Exchange: undefined;
    HelpSupport: undefined;
};

const CurrencySymbol = ({ color, size }: { color: string; size: number }) => {
    const [symbol, setSymbol] = useState("$");

    useEffect(() => {
        const interval = setInterval(() => {
            setSymbol((prev) => (prev === "$" ? "₱" : "$"));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={{ width: size, justifyContent: 'center', alignItems: 'center' }}>
            <RNText style={{
                color,
                fontSize: size + 2,
                fontWeight: '800',
                marginTop: -4
            }}>
                {symbol}
            </RNText>
        </View>
    );
};

export type MainTabParamList = {
    Account: undefined;
    Transfer: undefined;
    Card: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
    const { theme, colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.text,
                tabBarInactiveTintColor: colors.subtext,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "transparent",
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 80,
                    paddingBottom: 20,
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                },
                tabBarBackground: () => (
                    <BlurView
                        tint={theme === "dark" || route.name === "Transfer" ? "dark" : "light"}
                        intensity={route.name === "Transfer" ? 0 : 80}
                        style={[
                            StyleSheet.absoluteFill,
                            route.name === "Transfer" && { backgroundColor: colors.primary }
                        ]}
                    />
                ),
                tabBarIcon: ({ color, size }) => {
                    if (route.name === "Account") {
                        return <Home size={size} color={color} />;
                    } else if (route.name === "Transfer") {
                        return <CurrencySymbol color={color} size={size} />;
                    } else if (route.name === "Card") {
                        return <CreditCard size={size} color={color} />;
                    }
                },
            })}
        >
            <Tab.Screen name="Account" component={HomeScreen} />
            <Tab.Screen name="Transfer" component={TransferScreen} />
            <Tab.Screen name="Card" component={CardScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { status } = useCrossmintAuth();
    const { theme, colors } = useTheme();

    if (status === "initializing") {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: colors.card },
                    headerTintColor: colors.text,
                    headerTitleStyle: { fontWeight: "700" },
                    headerShadowVisible: false,
                    cardStyle: { backgroundColor: colors.background }
                }}
            >
                {status === "logged-out" ? (
                    <>
                        <Stack.Screen
                            name="Landing"
                            component={LandingScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ title: "KinnectFi", headerShown: false }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Main"
                            component={MainTabs}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Balances"
                            component={BalancesScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Fund"
                            component={FundScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Transactions"
                            component={TransactionsScreen}
                            options={{ title: "Activity" }}
                        />
                        <Stack.Screen
                            name="SendTx"
                            component={SendTxScreen}
                            options={{ title: "Send Transaction" }}
                        />
                        <Stack.Screen
                            name="Profile"
                            component={ProfileScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Insights"
                            component={InsightsScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="CashDetails"
                            component={CashDetailsScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Explore"
                            component={ExploreScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="CardSettings"
                            component={CardSettingsScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Exchange"
                            component={ExchangeScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="HelpSupport"
                            component={HelpSupportScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
