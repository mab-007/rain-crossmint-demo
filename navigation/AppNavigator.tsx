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
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <RNText style={{
                color,
                fontSize: size + 2,
                fontWeight: '800',
                marginTop: -2
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
                tabBarIcon: ({ focused, color, size }) => {
                    let icon;
                    const isTransfer = route.name === "Transfer";
                    const activeIconColor = isTransfer ? "#000000" : "#000000";
                    const iconColor = focused ? activeIconColor : color;

                    if (route.name === "Account") {
                        icon = <Home size={size} color={iconColor} />;
                    } else if (isTransfer) {
                        icon = <CurrencySymbol color={iconColor} size={size} />;
                    } else if (route.name === "Card") {
                        icon = <CreditCard size={size} color={iconColor} />;
                    }

                    return (
                        <View style={styles.tabItemContainer}>
                            <View style={[
                                styles.iconContainer,
                                focused && !isTransfer && { backgroundColor: colors.primary + '15' },
                                focused && isTransfer && { backgroundColor: 'rgba(0,0,0,0.1)' }
                            ]}>
                                {icon}
                            </View>
                            {focused && <View style={[styles.activeDot, { backgroundColor: isTransfer ? '#000000' : colors.primary }]} />}
                        </View>
                    );
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
const styles = StyleSheet.create({
    tabItemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    iconContainer: {
        width: 52,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        position: 'absolute',
        bottom: -12,
    },
});
