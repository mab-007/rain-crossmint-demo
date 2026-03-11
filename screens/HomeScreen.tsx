import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    ActivityIndicator,
    Platform,
    RefreshControl,
} from "react-native";
import { useCrossmintAuth, useWallet } from "@crossmint/client-sdk-react-native-ui";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import {
    ChevronRight,
    History,
    Wallet
} from "lucide-react-native";

type NavProp = StackNavigationProp<RootStackParamList, "Main">;

export default function HomeScreen() {
    const { user, logout } = useCrossmintAuth();
    const { wallet, status } = useWallet();
    const navigation = useNavigation<NavProp>();

    const [balance, setBalance] = useState<string>("0.00");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBalance = useCallback(async () => {
        if (!wallet) return;
        try {
            const result = await wallet.balances(["usdc", "usdxm"]);
            // Find USDXM specifically
            // @ts-ignore
            const tokens = result.tokens || [];
            // @ts-ignore
            const usdxmToken = tokens.find((t: any) => t.symbol?.toUpperCase() === "USDXM");

            if (usdxmToken) {
                setBalance(usdxmToken.amount);
            } else {
                // Fallback to USDC if USDXM not found (though stagingFund should give USDXM)
                // @ts-ignore
                setBalance(result.usdc?.amount || "0.00");
            }
        } catch (err) {
            console.error("Failed to fetch balance:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [wallet]);

    // Refresh balance whenever the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (wallet) {
                fetchBalance();
            }
        }, [wallet, fetchBalance])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchBalance();
    };

    const handleProfilePress = () => {
        navigation.navigate("Profile");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000" />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Money</Text>
                    <TouchableOpacity onPress={handleProfilePress} style={styles.profileBtn}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user?.email?.[0]?.toUpperCase() ?? "?"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Cash Balance Card - 1.7x size refinement */}
                <View style={styles.cardLarge}>
                    <TouchableOpacity style={styles.cardHeaderLarge}>
                        <View>
                            <Text style={styles.cardLabelLarge}>Cash balance</Text>
                            <Text style={styles.balanceTextLarge}>
                                ${balance} <Text style={styles.currencyTextLarge}>USDXM</Text>
                            </Text>
                            <Text style={styles.accountInfoLarge}>Account ••5430  Routing ••329</Text>
                        </View>
                        <ChevronRight size={24} color="#ccc" />
                    </TouchableOpacity>

                    <View style={styles.buttonRowLarge}>
                        <TouchableOpacity
                            style={styles.actionButtonLarge}
                            onPress={() => navigation.navigate("Fund")}
                        >
                            <Text style={styles.actionButtonTextLarge}>Add money</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButtonLarge}
                            onPress={() => Alert.alert("Withdraw", "Withdrawal feature coming soon!")}
                        >
                            <Text style={styles.actionButtonTextLarge}>Withdraw</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.paycheckRowLarge}>
                        <View style={styles.paycheckLeft}>
                            <View style={styles.checkIcon}>
                                <Text style={styles.checkIconText}>✓</Text>
                            </View>
                            <Text style={styles.paycheckTextLarge}>Paychecks</Text>
                        </View>
                        <View style={styles.paycheckRight}>
                            <Text style={styles.paycheckAmountLarge}>$0 this month</Text>
                            <ChevronRight size={18} color="#ccc" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Actual Functionality Sections */}
                <View style={styles.sectionCard}>
                    <TouchableOpacity
                        style={styles.rowItem}
                        onPress={() => navigation.navigate("Balances")}
                    >
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: '#f0fdf4' }]}>
                                <Wallet size={22} color="#05b959" />
                            </View>
                            <View>
                                <Text style={styles.rowLabel}>Balances</Text>
                                <Text style={styles.rowSubtext}>View all your tokens and assets</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color="#ccc" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.rowItem}
                        onPress={() => navigation.navigate("Transactions")}
                    >
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: '#eff6ff' }]}>
                                <History size={22} color="#3b82f6" />
                            </View>
                            <View>
                                <Text style={styles.rowLabel}>Activity</Text>
                                <Text style={styles.rowSubtext}>View your transaction history</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>

                {/* Wallet Info (Debug/Staging) */}
                {wallet && (
                    <View style={styles.debugInfo}>
                        <Text style={styles.debugText}>Wallet: {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</Text>
                        <Text style={styles.debugText}>Network: Base Sepolia (Staging)</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f6f6f6" },
    scroll: { padding: 16, paddingBottom: 40 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 8,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#000',
    },
    profileBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e2e2e2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#666',
    },

    // Large Card Styles (1.7x refinement)
    cardLarge: {
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 24,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    cardHeaderLarge: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    cardLabelLarge: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    balanceTextLarge: {
        fontSize: 52,
        fontWeight: '800',
        color: '#000',
        marginBottom: 8,
    },
    currencyTextLarge: {
        fontSize: 24,
        fontWeight: '600',
        color: '#666',
    },
    accountInfoLarge: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },

    buttonRowLarge: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    actionButtonLarge: {
        flex: 1,
        backgroundColor: '#000',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonTextLarge: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },

    paycheckRowLarge: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    paycheckTextLarge: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
    },
    paycheckAmountLarge: {
        fontSize: 16,
        color: '#999',
        marginRight: 6,
    },

    paycheckLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#05b959',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkIconText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    paycheckRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    rowItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    rowLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    rowSubtext: {
        fontSize: 13,
        color: '#999',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 4,
    },

    debugInfo: {
        marginTop: 20,
        alignItems: 'center',
    },
    debugText: {
        fontSize: 10,
        color: '#ccc',
    },
});

