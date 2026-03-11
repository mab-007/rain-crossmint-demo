import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useCrossmintAuth } from "@crossmint/client-sdk-react-native-ui";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Home, DollarSign, CreditCard, History, PlusCircle, Send } from "lucide-react-native";
import { BlurView } from "expo-blur";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import BalancesScreen from "../screens/BalancesScreen";
import FundScreen from "../screens/FundScreen";
import TransferScreen from "../screens/TransferScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import SendTxScreen from "../screens/SendTxScreen";
import CardScreen from "../screens/CardScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type RootStackParamList = {
    Login: undefined;
    Main: undefined;
    Balances: undefined;
    Fund: undefined;
    Transactions: undefined;
    SendTx: undefined;
    Profile: undefined;
};

export type MainTabParamList = {
    Account: undefined;
    Transfer: undefined;
    Card: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#000",
                tabBarInactiveTintColor: "#999",
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
                        tint={route.name === "Transfer" ? "dark" : "light"}
                        intensity={route.name === "Transfer" ? 0 : 80}
                        style={[
                            StyleSheet.absoluteFill,
                            route.name === "Transfer" && { backgroundColor: "#05b959" }
                        ]}
                    />
                ),
                tabBarIcon: ({ color, size }) => {
                    if (route.name === "Account") {
                        return <Home size={size} color={color} />;
                    } else if (route.name === "Transfer") {
                        return <DollarSign size={size} color={color} />;
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

    if (status === "initializing") {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#05b959" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: "#fff" },
                    headerTintColor: "#000",
                    headerTitleStyle: { fontWeight: "700" },
                    headerShadowVisible: false,
                }}
            >
                {status === "logged-out" ? (
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ title: "StableCoin Wallet", headerShown: false }}
                    />
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
                            options={{ title: "Balances" }}
                        />
                        <Stack.Screen
                            name="Fund"
                            component={FundScreen}
                            options={{ title: "Add Money" }}
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
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
