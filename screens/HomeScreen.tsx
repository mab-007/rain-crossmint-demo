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
    Image as RNImage
} from "react-native";
import { useCrossmintAuth, useWallet } from "@crossmint/client-sdk-react-native-ui";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import {
    ChevronRight,
    Wallet,
    TrendingUp,
    Plus,
    Zap,
} from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

type NavProp = StackNavigationProp<RootStackParamList, "Main">;

// No dummy transactions on home screen (they live in CashDetails)

export default function HomeScreen() {
    const { user, logout } = useCrossmintAuth();
    const { wallet, status } = useWallet();
    const navigation = useNavigation<NavProp>();
    const { theme, colors } = useTheme();

    const [balance, setBalance] = useState<string>("0.00");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBalance = useCallback(async () => {
        if (!wallet) return;
        try {
            const result = await wallet.balances(["usdc", "usdxm"]);
            // @ts-ignore
            const tokens = result.tokens || [];
            // @ts-ignore
            const usdxmToken = tokens.find((t: any) => t.symbol?.toUpperCase() === "USDXM");
            if (usdxmToken) {
                setBalance(usdxmToken.amount);
            } else {
                // @ts-ignore
                setBalance(result.usdc?.amount || "0.00");
            }
        } catch (err) {
            console.error("Failed to fetch balance:", err);
        }
    }, [wallet]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        await fetchBalance();
        setLoading(false);
        setRefreshing(false);
    }, [fetchBalance]);

    useFocusEffect(
        useCallback(() => {
            if (wallet) {
                fetchData();
            }
        }, [wallet, fetchData])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleProfilePress = () => {
        navigation.navigate("Profile");
    };

    const phpBalance = (Number(balance) * 56).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const phpInterest = (12.45 * 56).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Fixed Top Section */}
            <View style={[styles.fixedHeader, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Money</Text>
                    <TouchableOpacity onPress={handleProfilePress} style={styles.profileBtn}>
                        <RNImage source={require('../assets/icon.png')} style={styles.avatarImage} />
                    </TouchableOpacity>
                </View>

                {/* Cash Balance Card (USD) */}
                <View style={[styles.cardLarge, { backgroundColor: colors.card, shadowColor: colors.text }]}>
                    <TouchableOpacity
                        style={styles.cardHeaderLarge}
                        onPress={() => navigation.navigate("CashDetails")}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={styles.titleRow}>
                                <Text style={[styles.cardLabelLarge, { color: colors.text }]}>Cash balance 🇺🇸</Text>
                            </View>
                            <Text style={[styles.cardSubtitle, { color: colors.subtext }]}>USD</Text>
                            <Text style={[styles.balanceTextLarge, { color: colors.text }]}>
                                ${Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                            <View style={styles.interestRow}>
                                <TrendingUp size={13} color={colors.primary} />
                                <Text style={[styles.interestEarnedText, { color: colors.primary }]}>Interest earned $12.45</Text>
                            </View>
                        </View>
                        <ChevronRight size={22} color={colors.subtext} />
                    </TouchableOpacity>

                    {/* Single large Add Money button */}
                    <TouchableOpacity
                        style={[styles.addMoneyBtn, { backgroundColor: colors.text }]}
                        onPress={() => navigation.navigate("Fund")}
                    >
                        <Plus size={18} color={colors.card} />
                        <Text style={[styles.addMoneyBtnText, { color: colors.card }]}>Add money</Text>
                    </TouchableOpacity>

                    <View style={styles.expansionIndicatorContainer}>
                        <View style={[styles.expansionHandle, { backgroundColor: colors.border }]} />
                    </View>
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {/* Cash Balance Card (PHP) */}
                <View style={[styles.cardLarge, { backgroundColor: colors.card, shadowColor: colors.text }]}>
                    <View style={styles.cardHeaderLarge}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.phpTitleRow}>
                                <Text style={styles.flagEmoji}>🇵🇭</Text>
                                <View>
                                    <Text style={[styles.cardLabelLarge, { color: colors.text }]}>Balanseng pera</Text>
                                    <Text style={[styles.cardSubtitle, { color: colors.subtext }]}>PHP</Text>
                                </View>
                            </View>
                            <Text style={[styles.balanceTextLarge, { color: colors.text }]}>
                                ₱{phpBalance}
                            </Text>
                            <View style={styles.interestRow}>
                                <TrendingUp size={13} color={colors.primary} />
                                <Text style={[styles.interestEarnedText, { color: colors.primary }]}>Interest earned ₱{phpInterest}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Add Money button for PHP */}
                    <TouchableOpacity
                        style={[styles.addMoneyBtn, { backgroundColor: colors.text, marginTop: 20 }]}
                        onPress={() => navigation.navigate("Fund")}
                    >
                        <Plus size={18} color={colors.card} />
                        <Text style={[styles.addMoneyBtnText, { color: colors.card }]}>Add money</Text>
                    </TouchableOpacity>
                </View>

                {/* Monthly Spend Card */}
                <TouchableOpacity
                    style={[styles.spendCard, { backgroundColor: colors.card, shadowColor: colors.text }]}
                    onPress={() => navigation.navigate("Insights")}
                >
                    <View style={styles.spendHeader}>
                        <View>
                            <Text style={[styles.spendLabel, { color: colors.text }]}>Monthly spend</Text>
                            <Text style={[styles.spendAmount, { color: colors.text }]}>$2,560.00</Text>
                            <Text style={[styles.insightCopy, { color: theme === "dark" ? "#fbbf24" : "#f59e0b" }]}>Your spending is up 12% this month</Text>
                        </View>
                        <View style={[styles.trendBadge, { backgroundColor: theme === "dark" ? "rgba(5, 185, 89, 0.1)" : "#f0fdf4" }]}>
                            <TrendingUp size={14} color={colors.primary} />
                            <Text style={[styles.trendText, { color: colors.primary }]}>12%</Text>
                        </View>
                    </View>

                    {/* Mini Graph */}
                    <View style={styles.miniGraphContainer}>
                        <Svg height="100" width="100%">
                            <Defs>
                                <LinearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0" stopColor="#05b959" stopOpacity="0.2" />
                                    <Stop offset="1" stopColor="#05b959" stopOpacity="0" />
                                </LinearGradient>
                            </Defs>
                            <Path
                                d="M0 80 C20 80, 40 40, 60 60 C80 80, 100 20, 120 40 C140 60, 160 10, 180 30 C200 50, 220 10, 240 20 C260 30, 280 10, 300 15"
                                fill="none"
                                stroke={colors.primary}
                                strokeWidth="3"
                            />
                            <Path
                                d="M0 80 C20 80, 40 40, 60 60 C80 80, 100 20, 120 40 C140 60, 160 10, 180 30 C200 50, 220 10, 240 20 C260 30, 280 10, 300 15 L300 100 L0 100 Z"
                                fill="url(#miniGrad)"
                            />
                        </Svg>
                    </View>
                </TouchableOpacity>

                {/* Wallet Debug Info */}
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
    container: { flex: 1 },
    fixedHeader: {
        paddingHorizontal: 24,
        paddingTop: 0,
        zIndex: 10,
    },
    scroll: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 120,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 8,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
    },
    profileBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        backgroundColor: '#e2e2e2',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    // Cash Balance Card
    cardLarge: {
        borderRadius: 28,
        paddingHorizontal: 24,
        paddingVertical: 32,
        marginBottom: 20,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 6,
    },
    cardHeaderLarge: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    cardLabelLarge: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 12,
    },
    balanceTextLarge: {
        fontSize: 40,
        fontWeight: '800',
        marginBottom: 2,
        letterSpacing: -1,
    },
    currencyTextLarge: {
        fontSize: 20,
        fontWeight: '600',
    },
    interestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 3,
    },
    interestEarnedText: {
        fontSize: 13,
        fontWeight: '500',
        fontStyle: 'italic',
    },

    // PHP Specific
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    phpTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 2,
    },
    flagEmoji: {
        fontSize: 28,
        marginTop: -4,
    },

    // Single Add Money button
    addMoneyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 52,
        borderRadius: 26,
        marginBottom: 16,
    },
    addMoneyBtnText: {
        fontSize: 16,
        fontWeight: '700',
    },

    expansionIndicatorContainer: {
        alignItems: 'center',
    },
    expansionHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
    },

    // Spend Card
    spendCard: {
        borderRadius: 28,
        padding: 24,
        marginBottom: 20,
        height: 260,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 6,
    },
    spendHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    spendLabel: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    spendAmount: {
        fontSize: 28,
        fontWeight: '800',
    },
    insightCopy: {
        fontSize: 12,
        marginTop: 3,
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    trendText: {
        fontSize: 13,
        fontWeight: '700',
    },
    miniGraphContainer: {
        height: 100,
        width: '100%',
        marginTop: 4,
    },

    // Transactions Card
    txCard: {
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 4,
        marginBottom: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 3,
    },
    txSectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
    },
    txRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    txIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    txInfo: {
        flex: 1,
    },
    txName: {
        fontSize: 15,
        fontWeight: '600',
    },
    txSub: {
        fontSize: 12,
        marginTop: 2,
    },
    txAmount: {
        fontSize: 15,
        fontWeight: '600',
    },
    txDivider: {
        height: 0.5,
        marginLeft: 58,
    },
    viewAllRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 4,
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
    },

    debugInfo: {
        marginTop: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    debugText: {
        fontSize: 10,
        color: '#ccc',
    },
});
