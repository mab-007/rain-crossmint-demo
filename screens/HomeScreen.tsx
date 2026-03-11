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
import {
    ChevronRight,
    History,
    Wallet,
    ArrowDownLeft,
    ArrowUpRight,
    CheckCircle2,
    Tv,
    Music,
    Utensils,
    Minus,
    MoreVertical,
    ShoppingBag,
    Coffee,
    TrendingUp,
    TrendingDown
} from "lucide-react-native";

type NavProp = StackNavigationProp<RootStackParamList, "Main">;

export default function HomeScreen() {
    const { user, logout } = useCrossmintAuth();
    const { wallet, status } = useWallet();
    const navigation = useNavigation<NavProp>();

    const [balance, setBalance] = useState<string>("0.00");
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const DUMMY_TRANSACTIONS = [
        { id: 'd1', action: 'payment', merchant: 'Spotify', subtitle: 'Monthly payment', amount: '10', createdAt: '2021.05.04', image: require('../assets/spotify.png'), color: '#1DB954', type: 'debit' },
        { id: 'd2', action: 'credit', merchant: 'Refund', subtitle: 'Apple Store', amount: '120', createdAt: '2021.05.04', image: require('../assets/dollar.png'), color: '#05b959', type: 'credit' },
        { id: 'd3', action: 'payment', merchant: 'Netflix', subtitle: 'Monthly payment', amount: '15.99', createdAt: '2021.05.04', image: require('../assets/netflix.png'), color: '#E50914', type: 'debit' },
        { id: 'd4', action: 'payment', merchant: 'Youtube', subtitle: 'Monthly payment', amount: '12', createdAt: '2021.05.04', image: require('../assets/youtube.png'), color: '#FF0000', type: 'debit' },
        { id: 'd5', action: 'credit', merchant: 'Cashback', subtitle: 'Rewards', amount: '5.00', createdAt: '2021.05.02', image: require('../assets/dollar.png'), color: '#05b959', type: 'credit' },
        { id: 'd6', action: 'payment', merchant: 'Apple TV', subtitle: 'Monthly payment', amount: '9.99', createdAt: '2021.05.01', image: require('../assets/appletv.png'), color: '#000000', type: 'debit' },
    ];

    const formatTxDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;

        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);

        let suffix = 'th';
        if (day === 1 || day === 21 || day === 31) suffix = 'st';
        else if (day === 2 || day === 22) suffix = 'nd';
        else if (day === 3 || day === 23) suffix = 'rd';

        return `${day}${suffix} ${month}'${year}`;
    };

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
        }
    }, [wallet]);

    const fetchTransactions = useCallback(async () => {
        if (!wallet) return;
        try {
            const result = await (wallet as any).experimental_transactions?.();
            const txs = Array.isArray(result) ? result : result?.transactions ?? [];
            // Filter for "Add money" (stagingFund) or relevant types
            const realTxs = txs.filter((tx: any) =>
                tx.action === "stagingFund" || tx.action === "transfer"
            );

            // Merge real and dummy transactions
            const allTxs = [...realTxs, ...DUMMY_TRANSACTIONS].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setTransactions(allTxs);
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
        }
    }, [wallet]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        await Promise.all([fetchBalance(), fetchTransactions()]);
        setLoading(false);
        setRefreshing(false);
    }, [fetchBalance, fetchTransactions]);

    // Refresh data whenever the screen comes into focus
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

    return (
        <SafeAreaView style={styles.container}>
            {/* Fixed Top Section */}
            <View style={styles.fixedHeader}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Money</Text>
                    <TouchableOpacity onPress={handleProfilePress} style={styles.profileBtn}>
                        <RNImage source={require('../assets/icon.png')} style={styles.avatarImage} />
                    </TouchableOpacity>
                </View>

                {/* Cash Balance Card - Fixed */}
                <View style={styles.cardLarge}>
                    <TouchableOpacity
                        style={styles.cardHeaderLarge}
                        onPress={() => navigation.navigate("Balances")}
                    >
                        <View>
                            <Text style={styles.cardLabelLarge}>Cash balance</Text>
                            <Text style={styles.balanceTextLarge}>
                                ${Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <Text style={styles.currencyTextLarge}>USD</Text>
                            </Text>
                            <Text style={styles.interestEarnedText}>Interest earned $12.45</Text>
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
                            style={styles.actionButtonSecondary}
                            onPress={() => Alert.alert("Withdraw", "Withdrawal feature coming soon!")}
                        >
                            <Text style={styles.actionButtonTextSecondary}>Withdraw</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Expansion Indicator */}
                    <View style={styles.expansionIndicatorContainer}>
                        <View style={styles.expansionHandle} />
                    </View>
                </View>

                <View style={styles.historyHeaderFixed}>
                    <Text style={styles.historyTitle}>Latest transactions</Text>
                </View>
            </View>

            {/* Scrollable Transaction List */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000" />
                }
            >
                <View style={styles.historyContainer}>
                    {transactions.length === 0 ? (
                        <View style={styles.emptyHistory}>
                            <Text style={styles.emptyText}>No recent transactions</Text>
                        </View>
                    ) : (
                        <>
                            {transactions.slice(0, 10).map((tx, index) => (
                                <TouchableOpacity
                                    key={tx.id || index}
                                    style={styles.txCardItem}
                                    onPress={() => navigation.navigate("Transactions")}
                                >
                                    <View style={[styles.txIconSquare, { backgroundColor: '#f8f8f8' }]}>
                                        <View style={[styles.glowEffect, { backgroundColor: tx.color || '#05b959' }]} />
                                        {tx.image ? (
                                            <RNImage source={tx.image} style={styles.brandImage} />
                                        ) : (
                                            tx.action === "stagingFund" || tx.type === 'credit' ? (
                                                <TrendingUp size={24} color="#05b959" />
                                            ) : (
                                                tx.icon === 'shopping-bag' ? <ShoppingBag size={24} color={tx.color} /> :
                                                    tx.icon === 'wallet' ? <Wallet size={24} color={tx.color} /> :
                                                        tx.icon === 'coffee' ? <Coffee size={24} color={tx.color} /> :
                                                            <TrendingDown size={24} color="#ff3b30" />
                                            )
                                        )}
                                    </View>
                                    <View style={styles.txInfoMain}>
                                        <Text style={styles.txMerchantName}>
                                            {tx.merchant || (tx.action === "stagingFund" ? "Add money" : "Transfer")}
                                        </Text>
                                        <Text style={styles.txSubtitle}>
                                            {tx.subtitle || (tx.action === "stagingFund" ? "Wallet funding" : "External transfer")}
                                        </Text>
                                        <Text style={styles.txDateText}>
                                            {formatTxDate(tx.createdAt)}
                                        </Text>
                                    </View>
                                    <View style={styles.txAmountSide}>
                                        <View style={styles.amountIndicatorRow}>
                                            {tx.action === "stagingFund" || tx.type === 'credit' ? (
                                                <TrendingUp size={14} color="#05b959" style={styles.amountIndicator} />
                                            ) : (
                                                <TrendingDown size={14} color="#ff3b30" style={styles.amountIndicator} />
                                            )}
                                            <Text style={[
                                                styles.txAmountValue,
                                                { color: (tx.action === "stagingFund" || tx.type === 'credit') ? "#05b959" : "#000" }
                                            ]}>
                                                ${tx.amount}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}

                            {transactions.length > 5 && (
                                <TouchableOpacity
                                    style={styles.viewAllCard}
                                    onPress={() => navigation.navigate("Transactions")}
                                >
                                    <Text style={styles.viewAllCardText}>View all transactions</Text>
                                    <ChevronRight size={18} color="#05b959" />
                                </TouchableOpacity>
                            )}
                        </>
                    )}
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
    fixedHeader: {
        paddingHorizontal: 24,
        paddingTop: 0, // Reduced from 16
        backgroundColor: "#f6f6f6",
        zIndex: 10,
    },
    scroll: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 120, // Extra padding to avoid nav bar overlap
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
        fontWeight: '800',
        color: '#000',
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
        marginBottom: 4,
    },
    interestEarnedText: {
        fontSize: 14,
        color: '#05b959',
        fontWeight: '600',
    },
    currencyTextLarge: {
        fontSize: 24,
        fontWeight: '600',
        color: '#666',
    },

    buttonRowLarge: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
        marginTop: 16, // Increased gap
    },
    actionButtonLarge: {
        flex: 1,
        backgroundColor: '#000',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonSecondary: {
        flex: 1,
        backgroundColor: '#fff',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e2e2',
    },
    actionButtonTextLarge: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
    actionButtonTextSecondary: {
        color: '#000',
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

    // Transaction History Styles
    historyHeaderFixed: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 24,
    },
    historyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
    },
    historyContainer: {
        gap: 12,
        marginBottom: 24,
    },
    txCardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 12, // Reduced padding
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    txIconSquare: {
        width: 56, // Slightly smaller icon container
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    brandImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    glowEffect: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.2,
        borderRadius: 20,
    },
    txInfoMain: {
        flex: 1,
    },
    txMerchantName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    txSubtitle: {
        fontSize: 14,
        color: '#999',
        marginBottom: 4,
    },
    txDateText: {
        fontSize: 12,
        color: '#666',
    },
    txAmountSide: {
        alignItems: 'flex-end',
    },
    txAmountValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    amountIndicatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amountIndicator: {
        marginRight: 4,
    },
    viewAllCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginTop: 8,
    },
    viewAllCardText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#05b959',
        marginRight: 8,
    },
    emptyHistory: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 15,
    },

    // Expansion Indicator Styles
    expansionIndicatorContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    expansionHandle: {
        width: 36,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#f0f0f0',
    },

    // View All Footer Styles
    viewAllFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    viewAllFooterText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#05b959',
        marginRight: 4,
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

