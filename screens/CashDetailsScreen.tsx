import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Alert,
    Image,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ChevronLeft, ChevronRight, Plus, ArrowLeftRight, Wallet } from "lucide-react-native";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";
import { useTheme } from "../context/ThemeContext";

const { height } = Dimensions.get("window");

// Dummy transactions using actual image assets
const DUMMY_TRANSACTIONS = [
    { id: '1', name: 'Netflix', sub: 'Subscription', amount: '-$15.99', type: 'debit', date: 'Today, 12:45 PM', img: require('../assets/netflix.png'), bg: '#fff1f1' },
    { id: '2', name: 'Apple TV+', sub: 'Subscription', amount: '-$9.99', type: 'debit', date: 'Yesterday, 10:00 AM', img: require('../assets/appletv.png'), bg: '#f5f5f7' },
    { id: '3', name: 'Spotify', sub: 'Music', amount: '-$9.99', type: 'debit', date: 'Yesterday, 8:30 AM', img: require('../assets/spotify.png'), bg: '#f0fdf4' },
    { id: '4', name: 'YouTube', sub: 'Subscription', amount: '-$13.99', type: 'debit', date: 'Oct 1, 9:00 AM', img: require('../assets/youtube.png'), bg: '#fff1f1' },
    { id: '5', name: 'Salary Deposit', amount: '+$2,500.00', type: 'credit', date: 'Sep 30, 9:00 AM', sub: 'Direct Deposit', img: require('../assets/dollar.png'), bg: '#f0fdf4' },
];

export default function CashDetailsScreen() {
    const navigation = useNavigation();
    const { wallet } = useWallet();
    const { theme, colors } = useTheme();
    const [usdBalance, setUsdBalance] = React.useState<number>(0);
    const [phpBalance, setPhpBalance] = React.useState<number>(0);

    const fetchBalances = React.useCallback(async () => {
        if (!wallet) return;
        try {
            const result = await wallet.balances(["usdc", "usdxm"]);
            // @ts-ignore
            const tokens = result.tokens || [];

            // USD Balance
            // @ts-ignore
            const usdxmToken = tokens.find((t: any) => t.symbol?.toUpperCase() === "USDXM");
            const usdVal = usdxmToken ? parseFloat(usdxmToken.amount) : parseFloat(result.usdc?.amount || "0");
            setUsdBalance(usdVal);

            // PHP Balance
            // @ts-ignore
            const phpToken = tokens.find((t: any) => t.symbol?.toUpperCase() === "PHP");
            setPhpBalance(phpToken ? parseFloat(phpToken.amount) : 0);
        } catch (err) {
            console.error("Failed to fetch balances in CashDetails:", err);
        }
    }, [wallet]);

    useFocusEffect(
        React.useCallback(() => {
            fetchBalances();
        }, [fetchBalances])
    );

    const formattedUSD = usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedPHP = phpBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Cash Details</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Hero Balance Card */}
                <View style={[styles.heroSection, { backgroundColor: colors.card }]}>
                    <View style={styles.walletsRow}>
                        <View style={styles.walletItem}>
                            <Text style={[styles.balanceLabel, { color: colors.subtext }]}>USD Balance</Text>
                            <Text style={[styles.balanceAmount, { color: colors.text }]}>${formattedUSD}</Text>
                        </View>
                        <View style={[styles.walletDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.walletItem}>
                            <Text style={[styles.balanceLabel, { color: colors.subtext }]}>PHP Balance</Text>
                            <Text style={[styles.balanceAmount, { color: colors.text }]}>₱{formattedPHP}</Text>
                        </View>
                    </View>

                    <View style={[styles.interestBadge, { backgroundColor: theme === "dark" ? "rgba(5, 185, 89, 0.1)" : "#e8faf1" }]}>
                        <Text style={[styles.interestText, { color: colors.primary }]}>+ $12.45 Interest this month</Text>
                    </View>

                    {/* Add Money + Exchange buttons */}
                    <View style={styles.heroButtonRow}>
                        <TouchableOpacity
                            style={[styles.heroBtn, { backgroundColor: colors.text }]}
                            onPress={() => navigation.navigate("Fund" as never)}
                        >
                            <Plus size={16} color={colors.card} />
                            <Text style={[styles.heroBtnText, { color: colors.card }]}>Add money</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.heroBtn, { backgroundColor: colors.background }]}
                            onPress={() => navigation.navigate("Exchange" as never)}
                        >
                            <ArrowLeftRight size={16} color={colors.text} />
                            <Text style={[styles.heroBtnSecText, { color: colors.text }]}>Exchange</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Transactions - individual capsules */}
                <Text style={[styles.txSectionTitle, { color: colors.text }]}>Recent transactions</Text>

                {DUMMY_TRANSACTIONS.map((tx) => (
                    <View key={tx.id} style={[styles.txCapsule, { backgroundColor: colors.card }]}>
                        <View style={[styles.txIconCircle, { backgroundColor: theme === "dark" ? colors.background : tx.bg }]}>
                            <Image source={tx.img} style={styles.txImg} resizeMode="contain" />
                        </View>
                        <View style={styles.txInfo}>
                            <Text style={[styles.txName, { color: colors.text }]}>{tx.name}</Text>
                            <Text style={[styles.txSub, { color: colors.subtext }]}>{tx.date}</Text>
                        </View>
                        <Text style={[styles.txAmount, { color: tx.type === 'credit' ? colors.primary : colors.text }]}>
                            {tx.amount}
                        </Text>
                    </View>
                ))}

                {/* View all link */}
                <TouchableOpacity
                    style={styles.viewAllRow}
                    onPress={() => navigation.navigate("Transactions" as never)}
                >
                    <Text style={[styles.viewAllText, { color: colors.primary }]}>View all transactions</Text>
                    <ChevronRight size={16} color={colors.primary} />
                </TouchableOpacity>
                {/* Currency Management */}
                <TouchableOpacity
                    style={[styles.currencyCard, { backgroundColor: colors.card, shadowColor: colors.text }]}
                    onPress={() => navigation.navigate("Balances" as never)}
                >
                    <View style={styles.currencyHeader}>
                        <View style={[styles.currencyIconBox, { backgroundColor: theme === "dark" ? "rgba(5, 185, 89, 0.1)" : "#f0fdf4" }]}>
                            <Wallet size={24} color={colors.primary} />
                        </View>
                        <View style={styles.currencyInfo}>
                            <Text style={[styles.currencyTitle, { color: colors.text }]}>Currency management</Text>
                            <Text style={[styles.currencySubtitle, { color: colors.subtext }]}>Manage your USD, USDC, and more</Text>
                        </View>
                        <ChevronRight size={20} color={colors.subtext} />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
        gap: 16,
        paddingTop: 8,
    },

    // Hero card
    heroSection: {
        borderRadius: 32,
        paddingVertical: 32,
        paddingHorizontal: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    balanceLabel: {
        fontSize: 13,
        marginBottom: 4,
    },
    balanceAmount: {
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    walletsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    walletItem: {
        flex: 1,
        alignItems: 'center',
    },
    walletDivider: {
        width: 1,
        height: 40,
        marginHorizontal: 12,
    },
    interestBadge: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        marginTop: 14,
    },
    interestText: {
        fontSize: 14,
        fontWeight: "600",
    },
    heroButtonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 24,
        width: "100%",
    },
    heroBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        height: 50,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    heroBtnText: {
        fontSize: 15,
        fontWeight: "700",
    },
    heroBtnSecText: {
        fontSize: 15,
        fontWeight: "700",
    },

    // Individual capsule per transaction
    txSectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    txCapsule: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 18,
        paddingVertical: 11,
        paddingHorizontal: 16,
        marginBottom: 6,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    txRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    txIconCircle: {
        width: 46,
        height: 46,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
        overflow: "hidden",
    },
    txImg: {
        width: 28,
        height: 28,
    },
    txInfo: { flex: 1 },
    txName: {
        fontSize: 15,
        fontWeight: "600",
    },
    txSub: {
        fontSize: 12,
        marginTop: 2,
    },
    txAmount: {
        fontSize: 15,
        fontWeight: "600",
    },
    viewAllRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        gap: 4,
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: "600",
    },
    // Currency Card
    currencyCard: {
        borderRadius: 24,
        padding: 20,
        marginTop: 8,
        marginBottom: 24,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    currencyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencyIconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    currencyInfo: {
        flex: 1,
    },
    currencyTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    currencySubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
});
